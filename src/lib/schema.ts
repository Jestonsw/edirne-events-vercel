import { pgTable, text, timestamp, integer, boolean, serial, varchar, real } from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  color: varchar('color', { length: 7 }).default('#C41E3A'),
  icon: varchar('icon', { length: 50 }).default('calendar'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  startTime: varchar('start_time', { length: 5 }),
  endTime: varchar('end_time', { length: 5 }),
  location: varchar('location', { length: 200 }).notNull(),
  address: text('address'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  organizerName: varchar('organizer_name', { length: 150 }),
  organizerContact: varchar('organizer_contact', { length: 150 }),
  categoryId: integer('category_id').references(() => categories.id),
  price: varchar('price', { length: 50 }).default('Ücretsiz'),
  capacity: integer('capacity'),
  imageUrl: varchar('image_url', { length: 500 }),
  imageUrl2: varchar('image_url_2', { length: 500 }),
  imageUrl3: varchar('image_url_3', { length: 500 }),
  websiteUrl: varchar('website_url', { length: 500 }),
  ticketUrl: varchar('ticket_url', { length: 500 }),
  tags: text('tags'), // JSON string array
  participantType: varchar('participant_type', { length: 100 }).default('Tüm yaş grupları'),
  rating: real('rating').default(0),
  reviewCount: integer('review_count').default(0),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Junction table for many-to-many relationship between events and categories
export const eventCategories = pgTable('event_categories', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 100 }).notNull(),
  eventId: integer('event_id').references(() => events.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Splash Screen Settings Table
export const venueCategories = pgTable('venue_categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  color: varchar('color', { length: 7 }).default('#6B7280'),
  icon: varchar('icon', { length: 50 }).default('building'),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const venues = pgTable('venues', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  categoryId: integer('category_id').references(() => venueCategories.id),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 20 }),
  phone2: varchar('phone2', { length: 20 }),
  email: varchar('email', { length: 100 }),
  website: varchar('website', { length: 500 }),
  capacity: integer('capacity'),
  amenities: text('amenities'), // Simple text, not JSON
  imageUrl: varchar('image_url', { length: 500 }),
  imageUrl2: varchar('image_url_2', { length: 500 }),
  imageUrl3: varchar('image_url_3', { length: 500 }),
  latitude: real('latitude'),
  longitude: real('longitude'),
  openingHours: text('opening_hours'),
  rating: real('rating').default(0),
  reviewCount: integer('review_count').default(0),
  priceRange: varchar('price_range', { length: 10 }).default('$$'),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  dateOfBirth: timestamp('date_of_birth'),
  gender: varchar('gender', { length: 10 }),
  city: varchar('city', { length: 50 }).default('Edirne'),
  district: varchar('district', { length: 50 }),
  interests: text('interests'), // JSON string array of interests
  isActive: boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  profileImageUrl: varchar('profile_image_url', { length: 500 }),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// User submission tables for content that needs admin approval
export const pendingEvents = pgTable('pending_events', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  startTime: varchar('start_time', { length: 5 }),
  endTime: varchar('end_time', { length: 5 }),
  location: varchar('location', { length: 200 }).notNull(),
  address: text('address'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  organizerName: varchar('organizer_name', { length: 150 }),
  organizerContact: varchar('organizer_contact', { length: 150 }),
  categoryId: integer('category_id').references(() => categories.id),
  price: varchar('price', { length: 50 }).default('Ücretsiz'),
  capacity: integer('capacity'),
  imageUrl: varchar('image_url', { length: 500 }),
  imageUrl2: varchar('image_url_2', { length: 500 }),
  imageUrl3: varchar('image_url_3', { length: 500 }),
  websiteUrl: varchar('website_url', { length: 500 }),
  ticketUrl: varchar('ticket_url', { length: 500 }),
  tags: text('tags'), // JSON string array
  participantType: varchar('participant_type', { length: 100 }).default('Tüm yaş grupları'),
  submitterEmail: varchar('submitter_email', { length: 150 }).notNull(),
  submitterName: varchar('submitter_name', { length: 100 }).notNull(),
  submitterPhone: varchar('submitter_phone', { length: 20 }),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected
  adminNotes: text('admin_notes'), // Admin feedback/notes
  approvedBy: varchar('approved_by', { length: 100 }),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Junction table for many-to-many relationship between pending events and categories
export const pendingEventCategories = pgTable('pending_event_categories', {
  id: serial('id').primaryKey(),
  pendingEventId: integer('pending_event_id').references(() => pendingEvents.id).notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const pendingVenues = pgTable('pending_venues', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  categoryId: integer('category_id').references(() => venueCategories.id),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 20 }),
  phone2: varchar('phone2', { length: 20 }),
  email: varchar('email', { length: 100 }),
  website: varchar('website', { length: 500 }),
  capacity: integer('capacity'),
  amenities: text('amenities'), // JSON string array
  imageUrl: varchar('image_url', { length: 500 }),
  imageUrl2: varchar('image_url_2', { length: 500 }),
  imageUrl3: varchar('image_url_3', { length: 500 }),
  latitude: real('latitude'),
  longitude: real('longitude'),
  openingHours: text('opening_hours'),
  priceRange: varchar('price_range', { length: 10 }).default('$$'),
  submitterEmail: varchar('submitter_email', { length: 150 }).notNull(),
  submitterName: varchar('submitter_name', { length: 100 }).notNull(),
  submitterPhone: varchar('submitter_phone', { length: 20 }),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected
  adminNotes: text('admin_notes'), // Admin feedback/notes
  approvedBy: varchar('approved_by', { length: 100 }),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // 'suggestion', 'complaint', 'bug', 'other'
  email: varchar('email', { length: 255 }),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  buttonText: varchar('button_text', { length: 100 }),
  buttonUrl: varchar('button_url', { length: 500 }),
  isActive: boolean('is_active').default(true),
  showOnce: boolean('show_once').default(false), // Show only once per user session
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Category = typeof categories.$inferSelect
export type Event = typeof events.$inferSelect
export type Favorite = typeof favorites.$inferSelect
export type User = typeof users.$inferSelect
export type VenueCategory = typeof venueCategories.$inferSelect
export type Venue = typeof venues.$inferSelect

export type PendingEvent = typeof pendingEvents.$inferSelect
export type PendingVenue = typeof pendingVenues.$inferSelect
export type Feedback = typeof feedback.$inferSelect
export type Announcement = typeof announcements.$inferSelect
export type EventReview = typeof eventReviews.$inferSelect
export type VenueReview = typeof venueReviews.$inferSelect

export type NewCategory = typeof categories.$inferInsert
export type NewEvent = typeof events.$inferInsert
export type NewFavorite = typeof favorites.$inferInsert
export type NewUser = typeof users.$inferInsert
export type NewVenueCategory = typeof venueCategories.$inferInsert
export type NewVenue = typeof venues.$inferInsert

export type NewPendingEvent = typeof pendingEvents.$inferInsert
export type NewPendingVenue = typeof pendingVenues.$inferInsert
export type NewFeedback = typeof feedback.$inferInsert

// User favorites table
export const userFavorites = pgTable('user_favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  eventId: integer('event_id').references(() => events.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Event reviews table
export const eventReviews = pgTable('event_reviews', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  isAnonymous: boolean('is_anonymous').default(false),
  isApproved: boolean('is_approved').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Venue reviews table
export const venueReviews = pgTable('venue_reviews', {
  id: serial('id').primaryKey(),
  venueId: integer('venue_id').references(() => venues.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  isAnonymous: boolean('is_anonymous').default(false),
  isApproved: boolean('is_approved').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type UserFavorite = typeof userFavorites.$inferSelect
export type NewUserFavorite = typeof userFavorites.$inferInsert