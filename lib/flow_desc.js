export const flow_desc = () => {
    const req_url = `${process.env.SERVER_URL}/api/missed/call`;
    return JSON.stringify({
        "description": "Missed Call Options",
        "states": [
            {
                "name": "Trigger",
                "type": "trigger",
                "transitions": [
                    {
                        "event": "incomingMessage"
                    },
                    {
                        "next": "gather_input",
                        "event": "incomingCall"
                    },
                    {
                        "event": "incomingConversationMessage"
                    },
                    {
                        "event": "incomingRequest"
                    },
                    {
                        "event": "incomingParent"
                    }
                ],
                "properties": {
                    "offset": {
                        "x": 190,
                        "y": 40
                    }
                }
            },
            {
                "name": "gather_input",
                "type": "gather-input-on-call",
                "transitions": [
                    {
                        "next": "split_key_press",
                        "event": "keypress"
                    },
                    {
                        "event": "speech"
                    },
                    {
                        "event": "timeout"
                    }
                ],
                "properties": {
                    "voice": "woman",
                    "offset": {
                        "x": 330,
                        "y": 200
                    },
                    "finish_on_key": "",
                    "say": "The Service you are trying to reach is offline at the moment. Please Press 1 to get a text back from our office. Or press 2 to receive a call back from our office during working hours",
                    "language": "en",
                    "stop_gather": true,
                    "speech_model": "phone_call",
                    "profanity_filter": "true",
                    "timeout": 30,
                    "number_of_digits": 1,
                    "speech_timeout": "auto",
                    "loop": 1,
                    "gather_language": "en"
                }
            },
            {
                "name": "split_key_press",
                "type": "split-based-on",
                "transitions": [
                    {
                        "event": "noMatch"
                    },
                    {
                        "next": "tag_text_back",
                        "event": "match",
                        "conditions": [
                            {
                                "friendly_name": "1",
                                "arguments": [
                                    "{{widgets.gather_input.Digits}}"
                                ],
                                "type": "equal_to",
                                "value": "1"
                            }
                        ]
                    },
                    {
                        "next": "tag_call_back",
                        "event": "match",
                        "conditions": [
                            {
                                "friendly_name": "2",
                                "arguments": [
                                    "{{widgets.gather_input.Digits}}"
                                ],
                                "type": "equal_to",
                                "value": "2"
                            }
                        ]
                    }
                ],
                "properties": {
                    "input": "{{widgets.gather_input.Digits}}",
                    "offset": {
                        "x": 360,
                        "y": 450
                    }
                }
            },
            {
                "name": "tag_text_back",
                "type": "make-http-request",
                "transitions": [
                    {
                        "next": "confirm",
                        "event": "success"
                    },
                    {
                        "next": "confirm",
                        "event": "failed"
                    }
                ],
                "properties": {
                    "offset": {
                        "x": 470,
                        "y": 790
                    },
                    "method": "POST",
                    "content_type": "application/json;charset=utf-8",
                    "body": "{\n\"tags\":\"textback\",\n\"caller\": {{trigger.call.From}} ,\n\"to\": {{trigger.call.To}} ,\n\"flow_sid\": {{flow.sid}}\n}",
                    "url": `${req_url}`
                }
            },
            {
                "name": "tag_call_back",
                "type": "make-http-request",
                "transitions": [
                    {
                        "next": "confirm",
                        "event": "success"
                    },
                    {
                        "next": "confirm",
                        "event": "failed"
                    }
                ],
                "properties": {
                    "offset": {
                        "x": 110,
                        "y": 800
                    },
                    "method": "POST",
                    "content_type": "application/json;charset=utf-8",
                    "body": "{\n\"tags\":\"call_back\",\n\"caller\": {{trigger.call.From}} ,\n\"to\": {{trigger.call.To}} ,\n\"flow_sid\": {{flow.sid}}\n}",
                    "url": `${req_url}`
                }
            },
            {
                "name": "confirm",
                "type": "say-play",
                "transitions": [
                    {
                        "event": "audioComplete"
                    }
                ],
                "properties": {
                    "voice": "woman",
                    "offset": {
                        "x": 300,
                        "y": 1120
                    },
                    "loop": 1,
                    "say": "Your request has been confirmed and our team will contact you shortly. Thanks for connecting",
                    "language": "en-US"
                }
            }
        ],
        "initial_state": "Trigger",
        "flags": {
            "allow_concurrent_calls": true
        }
    });
}