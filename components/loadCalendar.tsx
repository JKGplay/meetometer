'use client'
import {Calendar, CalendarProps, momentLocalizer, Views} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"
import '@/app/meet/[meetId]/index.css'
import {useState} from "react";
import colors from "@/lib/colors";

const localizer = momentLocalizer(moment);

export default function LoadCalendar(params: any) {
    const meet = params.meet;
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(meet.dateFrom);
    const events: Object[] = [];

    meet.participants.forEach((participant: any, participantIndex: number) => {
        let tempStart: Date|null = null;
        let tempEnd: Date|null = null;
        for (const [dayIndex, day] of participant.availableDays.entries()) {
            tempStart = tempStart || day;//makes that if tempStart is null, it becomes a day
            tempEnd = tempEnd || day;//makes that if tempEnd is null, it becomes a day
            if (participant.availableDays[dayIndex + 1] === undefined || participant.availableDays[dayIndex + 1].getTime() - participant.availableDays[dayIndex].getTime() !== 86400000) {
                events.push({
                    start: tempStart,
                    end: tempEnd,
                    title: participant.user.username,
                    color: colors[participantIndex % colors.length],
                })
                tempStart = null;
                tempEnd = null;
                continue;
            }
            tempEnd = participant.availableDays[dayIndex + 1]
        }
    })

    const components = {
        event:(props: any) => {
            const theme = props?.event?.color;
            console.log("props", props);
            return <div className={`event-container ${theme}`}>{props?.event?.title}</div>
        }
    }

    const customDayPropGetter = (date: Date) => {
        if (date.getTime() >= meet.dateFrom && date.getTime() <= meet.dateTo) {
            return {
                className: `available-day`,
            }
        }
        return {}
    }

    return (
        <div className="h-[80vh]">
            <Calendar
                localizer={localizer}
                events={events}
                dayPropGetter={customDayPropGetter}
                view={view}
                defaultView={view}
                views={['month']}
                showAllEvents={true}
                date={date}
                components={components}
                onView={(view: any) => setView(view)}
                onNavigate={(date) => setDate(new Date(date))}
            />
        </div>
    )
}