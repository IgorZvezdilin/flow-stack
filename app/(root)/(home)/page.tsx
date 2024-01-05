import { UserButton } from "@clerk/nextjs"

export default function Home() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className=' h1-bold '>Hello Next js</h1>
        <div>
            <UserButton afterSignOutUrl="/"/>
        </div>
      </main>
    )
  }
  