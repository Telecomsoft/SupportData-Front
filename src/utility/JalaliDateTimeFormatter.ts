export const formatJalaliDate = (value?: string | null) => {
    if (!value) return "-";

    const date = new Date(value);

    return date.toLocaleDateString("fa-IR", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
};


export const formatJalaliTime = (value?: string | null) => {
    if (!value) return "-";

    const date = new Date(value);

    return date.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        // second: "2-digit",
    });
};
