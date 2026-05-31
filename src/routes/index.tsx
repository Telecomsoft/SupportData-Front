import Login from '@components/screen/Login'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return <Login />
}