// Use when delete a schedule
const filterEvents = (events, id) =>
  events.filter((e) => {
    if (!e.schedules.includes(id)) return true;
    if (e.schedules.length === 1 && e.schedules[0] === id) return false;

    e.schedules = e.schedules.filter((schedule) => schedule !== id);
    return true;
  });

export default {
  filterEvents,
};
