"use client"

import { useGetCalls } from "@/hooks/useGetCalls"
import { Call, CallRecording } from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Loader from "./Loader"
import MeetingCard from "./MeetingCard"
import { useToast } from "./ui/use-toast"

export default function CallList({
  type
}: Readonly<{
  type: "ended" | "upcoming" | "recordings"
}>) {
  const router = useRouter()
  const { toast } = useToast()
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls()
  const [recordings, setRecordings] = useState<CallRecording[]>([])

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls
      case "recordings":
        return recordings
      case "upcoming":
        return upcomingCalls
      default:
        return []
    }
  }

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls"
      case "upcoming":
        return "No Upcoming Calls"
      case "recordings":
        return "No Recordings"
      default:
        return ""
    }
  }

  useEffect(() => {
    async function fetchRecordings() {
      try {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        )
        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings)

        setRecordings(recordings)
      } catch (error) {
        console.log(error)
        toast({ title: "Try again later" })
      }
    }
    if (type === "recordings") {
      fetchRecordings()
    }
  }, [type, callRecordings, toast])

  if (isLoading) return <Loader />

  const calls = getCalls()
  const noCallsMessage = getNoCallsMessage()

  const iconPaths = {
    ended: "/icons/previous.svg",
    upcoming: "/icons/upcoming.svg",
    recordings: "/icons/recordings.svg"
  }

  const icon = iconPaths[type]

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={icon}
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 20) ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              "Personal Meeting"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ??
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : "Start"}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () => router.push(`/meeting/${(meeting as Call).id}`)
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  )
}
