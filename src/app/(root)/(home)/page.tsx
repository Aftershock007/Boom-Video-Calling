"use client"

import MeetingTypeList from "@/components/MeetingTypeList"
import { useGetCalls } from "@/hooks/useGetCalls"
import { Loader2 } from "lucide-react"

export default function Home() {
  const now = new Date()
  const time = now
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
    .replace(/am|pm/i, (match) => match.toUpperCase())
  const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(
    now
  )

  const { upcomingCalls, isLoading } = useGetCalls()
  let upcomingMeetingTime, upcomingMeetingDateAndTime

  if (!isLoading && upcomingCalls?.[0]?.state?.startsAt) {
    const startsAt = new Date(upcomingCalls[0].state.startsAt)
    const formattedDate = startsAt
      .toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })
      .replace(/,/g, "")
    const formattedTime = startsAt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    })
    upcomingMeetingTime = `${formattedDate}, ${formattedTime}`
  }

  if (upcomingMeetingTime) {
    upcomingMeetingDateAndTime = (
      <h2 className="glassmorphism max-w-[28.5rem] rounded py-2 text-center text-base font-normal">
        Upcoming Meeting: {upcomingMeetingTime}
      </h2>
    )
  } else if (upcomingCalls?.length === 0) {
    upcomingMeetingDateAndTime = <div className="max-w-[28.5rem]"></div>
  } else {
    upcomingMeetingDateAndTime = <Loader2 />
  }

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          {upcomingMeetingDateAndTime}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  )
}
