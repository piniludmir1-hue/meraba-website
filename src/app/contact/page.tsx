import ContactClient from '@/app/contact/ContactClient'
import { getSiteContent } from '@/lib/supabaseCms'

export const dynamic = 'force-dynamic'

export default async function Contact() {
  const siteContent = await getSiteContent()

  return <ContactClient siteContent={siteContent} />
}
