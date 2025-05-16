"use client"

import { cn } from '@/lib/utils'
import Image from 'next/image'
import React, { useState } from 'react'


enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const Agent = ({
    userName,
    userId,
    type
} : AgentProps) => {
  
  const [currentCallStatus, setCurrentCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const isSpeaking = true
  const messages = [
    "Hi! whats your name?",
    "My name is vapi, nice to meet you!",
  ]
  const lastMessages = messages[messages.length - 1]

  return (
    <>
            <div className='call-view'>
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image src="/ai-avatar.png" width={40} height={40} alt="vapi" className='object-cover'/>
                        {isSpeaking && <span className='animate-speak'/>}
                    </div>
                    <h3>Ai Interviewer</h3>
                </div>
                <div className="card-border">
                    <div className="card-content">
                        <Image src="/user-avatar.png" alt='user' width={540} height={540} className='object-cover rounded-full size-[120px]'/>
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key={lastMessages} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {lastMessages}
                        </p>
                    </div>
                </div>
            )}
            <div className="w-full flex justify-center">
                {currentCallStatus !== CallStatus.ACTIVE ? (
                <button className="relative btn-call">
                    <span
                    className={cn(
                        "absolute animate-ping rounded-full opacity-75",
                        currentCallStatus !== CallStatus.CONNECTING && "hidden"
                    )}
                    />

                    <span className="relative">
                    {currentCallStatus === CallStatus.INACTIVE || currentCallStatus === CallStatus.FINISHED
                        ? "Call"
                        : ". . ."}
                    </span>
                </button>
                ) : (
                <button className="btn-disconnect">
                    End
                </button>
                )}
            </div>
    </>
  )
}

export default Agent