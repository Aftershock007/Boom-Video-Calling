"use client"

import { useUser } from "@clerk/nextjs"
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"
import { useGetCallById } from "@/hooks/useGetCallById"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Table from "@/components/Table"

export default function PersonalRoom() {
  const router = useRouter()
  const { user } = useUser()
  const client = useStreamVideoClient()
  const { toast } = useToast()
  const meetingId = user?.id

  const { call } = useGetCallById(meetingId!)

  async function startRoom() {
    if (!client || !user) {
      return
    }
    const newCall = client.call("default", meetingId!)
    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString()
        }
      })
    }
    router.push(`/meeting/${meetingId}?personal=true`)
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.username}'s meeting room`} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast({
              title: "Link Copied"
            })
          }}
        >
          Copy Invitation
        </Button>
      </div>
    </section>
  )
}
