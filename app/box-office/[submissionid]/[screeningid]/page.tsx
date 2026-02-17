import { use } from "react"
import BoxOfficeScreeningClient from "../../components/BoxOfficeScreeningClient"

export default function BoxOfficeScreening({ 
  params 
}: { 
  params: Promise<{ 
    submissionid: string;
    screeningid: string;
  }>
}) {
  const resolvedParams = use(params)

  return (
    <BoxOfficeScreeningClient 
      submissionid={resolvedParams.submissionid} 
      screeningid={resolvedParams.screeningid} 
    />
  )
}
