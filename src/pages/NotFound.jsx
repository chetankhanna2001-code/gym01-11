import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import Page from '../components/Page'

export default function NotFound() {
  return (
    <Page className="py-16">
      <EmptyState
        icon={Compass}
        title="This page skipped leg day"
        message="We couldn’t find what you were looking for. Let’s get you back on track."
        action={<Link to="/dashboard" className="btn-primary">Back to dashboard</Link>}
      />
    </Page>
  )
}
