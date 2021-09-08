import React, { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { CheckCircleIcon, ChevronRightIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import cn from 'classnames'
import Echo from './Echo'
import Spinner from './Spinner'

interface HealthCheckComponentProps {
  serviceName: string
  stackName: string
  url: string
}

type Status = 'loading' | 'success' | 'error'

interface HealthCheckSuccessfulEvent {
  serviceName: string
}

interface HealthCheckFailedEvent {
  serviceName: string
  error: string
}

export default function HealthCheckComponent (props: HealthCheckComponentProps): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false)
  const { serviceName, stackName, url } = props
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  const channel = useMemo(() => {
    return Echo.private(`Health.${serviceName}`)
      .listen('HealthCheckSuccessful', (evt: HealthCheckSuccessfulEvent) => {
        setStatus('success')
      }).listen('HealthCheckFailed', (evt: HealthCheckFailedEvent) => {
        setStatus('error')
        setError(evt.error)
      }).subscribed(() => {
        sendHealthCheckRequest()
      }).error((err: any) => {
        console.error(err)
        setStatus('error')
        setError(err.error)
      })
  }, [])

  function sendHealthCheckRequest () {
    setStatus('loading')
    const postUrl = url !== null ? url : '/health-check/start'
    
    axios.post(postUrl, {
        serviceName,
        stackName
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        setError(null)
      }).catch((err: any) => {
        console.error(err)
        setError(err.message)
        setStatus('error')
      }) 
  }

  function getExpandedText (): ReactNode {
    switch (status) {
      case 'loading': return 'Loading...'
      case 'success': return `${serviceName} is healthy.`
      case 'error': return <div>
        <p className="font-bold">An error has occured with {serviceName}</p>
        {error}
      </div>
    }
  }

  function getIcon (): ReactElement {
    switch (status) {
      case 'loading': return <Spinner className="w-6 h-6" />
      case 'success': return <CheckCircleIcon className="w-6 h-6 text-white" />
      case 'error': return <ExclamationCircleIcon className="w-6 h-6 text-white" />
    }
  }

  return (
    <div className="my-2">
      <div
        className="w-full bg-gray-600 shadow px-2 py-2 cursor-pointer flex justify-between"
        onClick={() => { setIsExpanded((isExpanded => !isExpanded)) }}
      >
        <div className="flex items-center">
          <p className="mr-2 text-white">{props.serviceName}</p>
          {getIcon()}
        </div>
        <div>
          <ChevronRightIcon className={cn('w-6 h-6 text-white', isExpanded ? 'transform rotate-90' : '')} />
        </div>
      </div>
      {isExpanded
        ? <div className="w-full bg-gray-200 px-2 py-2">
          {getExpandedText()}
        </div>
        : <></>}
    </div>
  )
}
