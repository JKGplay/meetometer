'use client'
import {Calendar, momentLocalizer, Views} from "react-big-calendar";
import moment from "moment";
import 'moment/locale/en-gb';
import "react-big-calendar/lib/css/react-big-calendar.css"
import '@/app/meet/[meetId]/index.css'
import {useCallback, useState} from "react";
import colors from "@/lib/colors";
import Image from "next/image";

const localizer = momentLocalizer(moment);

export default function LoadCalendar(params: any) {
    const meet = params.meet;
    const user = params.user;
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(meet.dateFrom);
    const [clicked, setClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const alreadyAvailable: any[] = [];
    let currentUserColor = colors[0];
    const participants: Object[] = [];
    const offset = new Date().getTimezoneOffset() * 60 * 1000;

    meet.participants.forEach((participant: any, participantIndex: number) => {
        if (participant.user.username === user.username) {
            currentUserColor = colors[participantIndex % colors.length];
        }
        let tempStart: Date|null = null;
        let tempEnd: Date|null = null;
        for (const [dayIndex, day] of participant.availableDays.entries()) {
            tempStart = tempStart || day;//makes that if tempStart is null, it becomes a day
            tempEnd = tempEnd || day;//makes that if tempEnd is null, it becomes a day
            if (participant.availableDays[dayIndex + 1] === undefined || participant.availableDays[dayIndex + 1].getTime() - participant.availableDays[dayIndex].getTime() !== 86400000) {
                participants.push({
                    //@ts-ignore
                    start: new Date(tempStart?.getTime() + offset),
                    //@ts-ignore
                    end: new Date(tempEnd?.getTime() + offset + 1),
                    title: participant.user.username,
                    color: colors[participantIndex % colors.length],
                })
                if (participant.user.username === user.username) {
                    alreadyAvailable.push(participants[participants.length - 1]);
                }
                tempStart = null;
                tempEnd = null;
                continue;
            }
            tempEnd = participant.availableDays[dayIndex + 1]
        }
    })

    const [events, setEvents] = useState(participants);

    const components = {
        event:(props: any) => {
            const theme = props?.event?.color;
            return <div className={`event-container ${theme}`}>{props?.event?.title}</div>
        }
    }

    const handleSelectSlot = useCallback(
        ({ start, end }: {start: Date, end: Date}) => {
            if (start.getTime() - offset >= meet.dateFrom && start.getTime() - offset <= meet.dateTo) {
                if (end.getTime() - offset - 86400000 >= meet.dateFrom && end.getTime() - offset - 86400000 <= meet.dateTo) {
                    const obj = {
                        start: new Date(start.getTime()),
                        end: new Date(end.getTime() - 86400000 + 1),
                        title: user.username,
                        color: "temp-day",
                    }
                    let elem = events.findLast((e: any) => (
                        (e.start.getTime() === start.getTime() || e.end.getTime() === end.getTime()) &&
                        e.title === obj.title))
                    if (elem !== undefined) {
                        setEvents(l => l.filter(event => event !== elem))
                    } else {
                        setEvents((prev) => [...prev, obj]);
                    }
                }
            }
        }, [meet.dateFrom, meet.dateTo, events, offset, user.username]
    )

    const handleSelectEvent = useCallback(
        (calEvent: any) => {
            //when you click on "temp-day event" it is removed
            if (calEvent.title === user.username) {
                setEvents(l => l.filter(day => day !== calEvent))
            }
        }, [user.username]
    )

    async function handleAvailability() {
        const tempClicked = !clicked;
        events.forEach((event: any, eventIndex: any) => {
            if (event.title === user.username) {
                const tempEvents = events;
                if (tempClicked) {
                    // @ts-ignore
                    tempEvents[eventIndex].color = "temp-day";
                } else {
                    // @ts-ignore
                    tempEvents[eventIndex].color = currentUserColor;
                }
                setEvents(tempEvents);
            }
        })
        if (!tempClicked) {
            const toChange: any[] = [];
            events.forEach((event: any) => {
                if (event.title === user.username) {
                    toChange.push(event);
                }
            })
            if (alreadyAvailable !== toChange) {
                setLoading(true);
                let daysToSend: any[] = [];
                for (const event of toChange) {
                    if (event.end.getTime() - event.start.getTime() === 1) {
                        daysToSend.push(new Date(event.start.getTime() - offset));
                        continue;
                    }
                    if (event.end.getTime() - event.start.getTime() === 86400000 + 1) {
                        daysToSend.push(new Date(event.start.getTime() - offset));
                        daysToSend.push(new Date(event.end.getTime() - offset - 1));
                        continue;
                    }
                    if (event.end.getTime() - event.start.getTime() > 86400000 + 1) {
                        for (let i = event.start.getTime(); i < event.end.getTime(); i += 86400000) {
                            daysToSend.push(new Date(i - offset));
                        }
                    }
                }
                daysToSend.sort((a, b) => a.getTime() - b.getTime());

                let epoch: number[] = [];

                daysToSend.forEach((day: any) => {
                    epoch.push(day.getTime());
                });
                epoch = Array.from(new Set(epoch));
                daysToSend = [];
                epoch.forEach((day: any) => {
                    daysToSend.push(new Date(day));
                })
                try {
                    const body = {
                        daysToSend,
                        userId: user?.id,
                        meetId: meet.id,
                    };
                    const response = await fetch('/api/change', {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body),
                    });

                    // const res = await response.json();
                    if (response.status === 200) {
                        window.location.reload();
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
        setClicked(tempClicked);
    }

    const customDayPropGetter = (date: Date) => {
        if (date.getTime() - offset >= meet.dateFrom && date.getTime() - offset <= meet.dateTo) {
            if (date.getDate() === new Date().getDate()) {
                return {
                    className: `today-available-day`,
                }
            }
            return {
                className: `available-day`,
            }
        }
        return {}
    }

    return (
        <div className={`h-[80vh]`}>
            <button
                className={`flex flex-row gap-3 p-1 mx-1 border border-black ${clicked ? "btn-change" : ""}`}
                onClick={handleAvailability}
            >
                <p>Change availability</p>
                <Image
                    className={`rotate align-middle ${loading ? '' : 'hidden'}`}
                    src='/spinner.svg'
                    height={24}
                    width={24}
                    alt="loading"
                />
            </button>
            <Calendar
                localizer={localizer}
                events={events}
                dayPropGetter={customDayPropGetter}
                view={view}
                defaultView={view}
                views={['month']}
                showAllEvents
                date={date}
                components={components}
                selectable
                onSelectSlot={clicked ? handleSelectSlot : () => {}}
                onSelectEvent={clicked ? handleSelectEvent : () => {}}
                onView={(view: any) => setView(view)}
                onNavigate={(date) => setDate(new Date(date))}
            />
        </div>
    )
}