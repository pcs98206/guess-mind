import events from './events';

export const handleHome = (req, res) => {
    return res.render("home", {events: JSON.stringify(events)});
};