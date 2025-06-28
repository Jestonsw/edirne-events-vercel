import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { categories, events, eventCategories } from '@/lib/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET() {
  try {
    const result = await db.select().from(categories).orderBy(asc(categories.sortOrder))
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, displayName, color, icon } = body

    if (!name || !displayName || !color) {
      return NextResponse.json({ error: 'Name, displayName, and color are required' }, { status: 400 })
    }

    const [newCategory] = await db.insert(categories).values({
      name,
      displayName,
      color,
      icon: icon || 'calendar'
    }).returning()

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, displayName, color, icon } = body

    if (!id || !name || !displayName || !color) {
      return NextResponse.json({ error: 'ID, name, displayName, and color are required' }, { status: 400 })
    }

    const [updatedCategory] = await db.update(categories)
      .set({
        name,
        displayName,
        color,
        icon: icon || 'calendar'
      })
      .where(eq(categories.id, id))
      .returning()

    if (!updatedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const categoryId = parseInt(id)

    // Check if category is used by any events
    const eventsWithCategory = await db.select().from(events).where(eq(events.categoryId, categoryId)).limit(1)
    
    if (eventsWithCategory.length > 0) {
      return NextResponse.json({ 
        error: 'Bu kategori etkinliklerde kullanılıyor. Önce bu kategorideki etkinlikleri silin veya başka kategoriye taşıyın.' 
      }, { status: 400 })
    }

    // Check if category is used in event categories junction table
    const eventCategoriesWithCategory = await db.select().from(eventCategories).where(eq(eventCategories.categoryId, categoryId)).limit(1)
    
    if (eventCategoriesWithCategory.length > 0) {
      // Delete from junction table first
      await db.delete(eventCategories).where(eq(eventCategories.categoryId, categoryId))
    }

    const [deletedCategory] = await db.delete(categories)
      .where(eq(categories.id, categoryId))
      .returning()

    if (!deletedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    if ((error as any).code === '23503') {
      return NextResponse.json({ 
        error: 'Bu kategori başka tablolarda kullanılıyor. Önce ilgili kayıtları silin.' 
      }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}