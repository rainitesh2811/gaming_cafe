import { AppPage } from '@/components/app-page'
import { auth } from '@/lib/auth'

export default async function Page() {
  const session = await auth()
  return <AppPage hasServerSession={Boolean(session)} />
}
