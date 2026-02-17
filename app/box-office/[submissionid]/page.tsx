import { use } from "react"
import BoxOfficeClient from "../components/BoxOfficeClient"

export default function BoxOffice({ 
  params 
}: { 
  params: Promise<{ 
    submissionid: string 
  }> 
}) {
  const resolvedParams = use(params)
  
  return (
    <BoxOfficeClient 
      submissionid={resolvedParams.submissionid} 
    />
  )
}
