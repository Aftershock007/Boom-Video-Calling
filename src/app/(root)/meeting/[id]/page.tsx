import React from "react"

export default function Meeting({ params }: { params: { id: string } }) {
  return <div>meeting room: #{params.id}</div>
}
