'use client'

import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import {PrismaClient} from "@prisma/client";

export default function Form({ userId }: { userId: string }) {

    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<any>([null, null]);
    const [startDate, endDate] = dateRange;

    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const dateRange = formData.get('dateRange') as string;

        let dateFrom: any = dateRange.split(" ")[0];
        dateFrom = dateFrom.split(".");
        [dateFrom[0], dateFrom[1]] = [dateFrom[1], dateFrom[0]];
        dateFrom = dateFrom.join(".");
        dateFrom = new Date(dateFrom);
        const offset = dateFrom.getTimezoneOffset();
        dateFrom.setMinutes(dateFrom.getMinutes() - offset);

        let dateTo: any = dateRange.split(" ")[2];
        dateTo = dateTo.split(".");
        [dateTo[0], dateTo[1]] = [dateTo[1], dateTo[0]];
        dateTo = dateTo.join(".");
        dateTo = new Date(dateTo);
        dateTo.setMinutes(dateTo.getMinutes() - offset);

        try {
            const body = { title, description, dateFrom, dateTo, userId};
            const response = await fetch('/api/meet', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const res = await response.json();
            if (res.meetId) {
                router.push(`/meet/${res.meetId}`);
                router.refresh();
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <form className="flex flex-col gap-2 mx-auto max-w-md mt-10" onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input
                className="border border-black text-black p-1"
                type="text"
                name="title"
                id="title"
                placeholder="BBQ"
                required
            />
            <label htmlFor="description">Description</label>
            <input
                className="border border-black text-black p-1"
                type="text"
                name="description"
                id="description"
                placeholder="Awesome BBQ!"
                required
            />
            <DatePicker
                className="border border-black text-black p-1"
                name="dateRange"
                id="dateRange"
                selectsRange={true}
                dateFormat="dd.MM.yyyy"
                minDate={new Date()}
                startDate={startDate}
                endDate={endDate}
                monthsShown={2}
                onChange={(update) => {
                    setDateRange(update);
                }}
                required
            />
            <button
                className="mx-auto border p-2 flex flex-row gap-3 bg-white text-black"
                type="submit"
            >
                <p>Create Meet</p>
                <Image
                    className={`rotate align-middle ${loading ? '' : 'hidden'}`}
                    src='/spinner.svg'
                    height={24}
                    width={24}
                    alt="loading"
                />
            </button>
        </form>
    )
}