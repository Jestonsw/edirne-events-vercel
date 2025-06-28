import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { events, categories, eventCategories, pendingEvents, pendingEventCategories } from '@/lib/schema'
import { eq, and, gte, lte, like, or, isNull, inArray, lt, not } from 'drizzle-orm'

// Function to automatically deactivate expired events
async function autoDeactivateExpiredEvents() {
  try {
    const now = new Date()
    
    // Find events that have passed their end date/time
    const expiredEvents = await db.select()
      .from(events)
      .where(
        and(
          eq(events.isActive, true),
          or(
            // Events with end date that have passed
            and(
              not(isNull(events.endDate)),
              lt(events.endDate, now)
            ),
            // Events with only start date that passed (end of start day)
            and(
              isNull(events.endDate),
              lt(events.startDate, new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
            )
          )
        )
      )

    if (expiredEvents.length > 0) {
      // Deactivate expired events
      for (const event of expiredEvents) {
        await db.update(events)
          .set({ 
            isActive: false,
            updatedAt: now
          })
          .where(eq(events.id, event.id))
      }
      

    }
  } catch (error) {
    console.error('Error auto-deactivating expired events:', error)
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const date = searchParams.get('date')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const admin = searchParams.get('admin')
    const countOnly = searchParams.get('count') === 'true'

    // Auto-deactivate expired events
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/expired-events`, {
        method: 'POST'
      })
    } catch (error) {
      // Fallback to local function if API call fails
      await autoDeactivateExpiredEvents()
    }
    
    // Apply filters
    const conditions = admin === 'true' ? [] : [eq(events.isActive, true)]

    if (category && category !== 'all') {
      const categoryRecord = await db.select().from(categories).where(eq(categories.name, category)).limit(1)
      if (categoryRecord.length > 0) {
        // Filter events that have this category in their junction table
        const eventsWithCategory = await db.select({ eventId: eventCategories.eventId })
          .from(eventCategories)
          .where(eq(eventCategories.categoryId, categoryRecord[0].id))
        
        if (eventsWithCategory.length > 0) {
          const eventIds = eventsWithCategory.map(ec => ec.eventId)
          conditions.push(inArray(events.id, eventIds))
        } else {
          // If no events found with this category, return empty result
          return NextResponse.json([])
        }
      }
    }

    if (date) {
      const selectedDate = new Date(date)
      const startOfDay = new Date(selectedDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(selectedDate)
      endOfDay.setHours(23, 59, 59, 999)
      
      // For date filtering, we need custom SQL to handle the multi-day logic
      // This will be processed separately in the result filtering
    }

    if (search) {
      conditions.push(
        or(
          like(events.title, `%${search}%`),
          like(events.description, `%${search}%`),
          like(events.location, `%${search}%`),
          like(events.organizerName, `%${search}%`)
        )!
      )
    }

    if (featured === 'true') {
      conditions.push(eq(events.isFeatured, true))
    }

    const result = await db.select({
      id: events.id,
      title: events.title,
      description: events.description,
      startDate: events.startDate,
      endDate: events.endDate,
      startTime: events.startTime,
      endTime: events.endTime,
      location: events.location,
      address: events.address,
      organizerName: events.organizerName,
      organizerContact: events.organizerContact,
      categoryId: events.categoryId,
      price: events.price,
      capacity: events.capacity,
      imageUrl: events.imageUrl,
      imageUrl2: events.imageUrl2,
      imageUrl3: events.imageUrl3,
      websiteUrl: events.websiteUrl,
      ticketUrl: events.ticketUrl,
      tags: events.tags,
      participantType: events.participantType,
      isActive: events.isActive,
      isFeatured: events.isFeatured,
      createdAt: events.createdAt,
      updatedAt: events.updatedAt
    }).from(events).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(events.startDate)

    // Fetch categories for each event
    const eventsWithCategories = await Promise.all(
      result.map(async (event) => {
        const eventCats = await db.select({
          categoryId: eventCategories.categoryId,
          categoryName: categories.name,
          categoryDisplayName: categories.displayName,
          categoryColor: categories.color,
          categoryIcon: categories.icon
        })
        .from(eventCategories)
        .leftJoin(categories, eq(eventCategories.categoryId, categories.id))
        .where(eq(eventCategories.eventId, event.id))

        return {
          ...event,
          categories: eventCats
        }
      })
    )

    // Apply date filtering after query if date parameter exists
    if (date) {
      const selectedDate = new Date(date)
      const startOfDay = new Date(selectedDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(selectedDate)
      endOfDay.setHours(23, 59, 59, 999)
      
      const filteredResult = eventsWithCategories.filter(event => {
        const eventStartDate = new Date(event.startDate)
        const eventEndDate = event.endDate ? new Date(event.endDate) : null
        
        // Event spans the selected date if:
        // 1. Start date <= selected date AND
        // 2. (No end date OR end date >= selected date)
        return eventStartDate <= endOfDay && 
               (!eventEndDate || eventEndDate >= startOfDay)
      })
      
      // If count only requested, return count
      if (countOnly) {
        return NextResponse.json({ count: filteredResult.length })
      }
      
      return NextResponse.json(filteredResult)
    }

    // If count only requested, return count
    if (countOnly) {
      return NextResponse.json({ count: eventsWithCategories.length })
    }

    // Add cache busting headers to force fresh data
    const response = NextResponse.json(eventsWithCategories)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('X-Fresh-Data', Date.now().toString())
    
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    
    // Validate categories (1-3 required)
    if (!body.categoryIds || !Array.isArray(body.categoryIds) || body.categoryIds.length < 1 || body.categoryIds.length > 3) {
      return NextResponse.json({ error: 'En az 1, en fazla 3 kategori seçmelisiniz' }, { status: 400 })
    }
    
    const newEvent = await db.insert(pendingEvents).values({
      title: body.title,
      description: body.description,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      startTime: body.startTime && body.startTime.trim() !== '' ? body.startTime : null,
      endTime: body.endTime && body.endTime.trim() !== '' ? body.endTime : null,
      location: body.location,
      address: body.address,
      latitude: body.latitude ? parseFloat(body.latitude) : null,
      longitude: body.longitude ? parseFloat(body.longitude) : null,
      organizerName: body.organizerName,
      organizerContact: body.organizerContact,
      categoryId: body.categoryIds[0], // Keep first category for backward compatibility
      price: body.price,
      capacity: body.capacity ? parseInt(body.capacity) : null,
      imageUrl: body.imageUrl,
      imageUrl2: body.imageUrl2,
      imageUrl3: body.imageUrl3,
      websiteUrl: body.websiteUrl,
      ticketUrl: body.ticketUrl,
      tags: body.tags ? JSON.stringify(body.tags) : null,
      participantType: body.participantType,
      submitterName: body.submitterName,
      submitterEmail: body.submitterEmail,
      submitterPhone: body.submitterPhone,
      status: 'pending',
    }).returning()

    // Insert category relationships
    const categoryPromises = body.categoryIds.map((categoryId: number) =>
      db.insert(pendingEventCategories).values({
        pendingEventId: newEvent[0].id,
        categoryId: categoryId
      })
    )
    
    await Promise.all(categoryPromises)


    // Add cache busting headers to invalidate frontend cache
    const response = NextResponse.json(newEvent[0], { status: 201 })
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('X-Cache-Bust', Date.now().toString())
    
    return response
  } catch (error) {
    console.error('🎉 Event API - error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('id')
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }
    
    // Check if this is a simple status toggle (only isActive field)
    if (Object.keys(body).length === 1 && 'isActive' in body) {
      const updatedEvent = await db.update(events)
        .set({
          isActive: body.isActive,
          updatedAt: new Date(),
        })
        .where(eq(events.id, parseInt(eventId)))
        .returning()

      return NextResponse.json(updatedEvent[0])
    }
    
    // Full event update
    // Validate categories (1-3 required)
    if (!body.categoryIds || !Array.isArray(body.categoryIds) || body.categoryIds.length < 1 || body.categoryIds.length > 3) {
      return NextResponse.json({ error: 'En az 1, en fazla 3 kategori seçmelisiniz' }, { status: 400 })
    }
    
    const updatedEvent = await db.update(events)
      .set({
        title: body.title,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        startTime: body.startTime && body.startTime.trim() !== '' ? body.startTime : null,
        endTime: body.endTime && body.endTime.trim() !== '' ? body.endTime : null,
        location: body.location,
        address: body.address,
        organizerName: body.organizerName,
        organizerContact: body.organizerContact,
        categoryId: body.categoryIds[0], // Keep first category for backward compatibility
        price: body.price,
        capacity: body.capacity,
        imageUrl: body.imageUrl,
        imageUrl2: body.imageUrl2,
        imageUrl3: body.imageUrl3,
        websiteUrl: body.websiteUrl,
        ticketUrl: body.ticketUrl,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        participantType: body.participantType,
        isActive: body.isActive,
        isFeatured: body.isFeatured || false,
        updatedAt: new Date(),
      })
      .where(eq(events.id, parseInt(eventId)))
      .returning()

    // Delete existing category relationships
    await db.delete(eventCategories).where(eq(eventCategories.eventId, parseInt(eventId)))
    
    // Insert new category relationships
    const categoryPromises = body.categoryIds.map((categoryId: number) =>
      db.insert(eventCategories).values({
        eventId: parseInt(eventId),
        categoryId: categoryId
      })
    )
    
    await Promise.all(categoryPromises)

    return NextResponse.json(updatedEvent[0])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}