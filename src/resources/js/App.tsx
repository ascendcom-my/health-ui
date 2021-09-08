import React, { ReactElement, useMemo } from 'react'
import HealthCheckComponent from './HealthCheckComponent'

export default function App (): ReactElement {
  const stack: Stack = useMemo(() => {
    const dataElement = document.getElementById('required-data')?.dataset.stack
    if (typeof dataElement !== 'undefined') {
      return JSON.parse(dataElement)
    }
    return null
  }, [])
  const url = useMemo(() => {
    const dataElement = document.getElementById('required-data')?.dataset.url
    return typeof dataElement !== 'undefined' ? dataElement : null
  }, [])

  if (stack === null) return (
    <div>Error retrieving stack from DOM element of ID 'required-data'.</div>
  )

  if (url === null) return (
    <div>Error retrieving url from DOM element of ID 'required-data'.</div>
  )

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <h1 className="text-xl px-2 py-2 border-b">Health Check</h1>
        <div className="w-full px-2 py-2">
          {stack.serviceNames.map(serviceName => 
            <HealthCheckComponent key={`HealthCheckComponent.${serviceName}`} serviceName={serviceName} stackName={stack.name} url={url} />
          )}
        </div>
      </div>
    </div>
  )
}

interface Stack {
  name: string
  serviceNames: string[]
}
