export type Event = {
  id: string
  title: string
  description: string | null
  event_date: string
  ticket_price: number | string
  max_capacity: number | null
  locations: {
    address: string
    city: string
    state: string | null
    country: string
    postal_code: string | null
  } | null
}