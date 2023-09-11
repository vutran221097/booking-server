exports.checkStatus = (startDate, endDate) => {
    const today = new Date(new Date().setHours(0, 0, 0, 0)).toString()
    if (today === new Date(startDate).toString() || today === new Date(endDate).toString()) {
        return "CheckIn"
    }
    if (new Date(today) > new Date(startDate) && new Date(today) < new Date(endDate)) {
        return "CheckIn"
    }
    if (new Date(today) < new Date(startDate)) {
        return "Booked"
    }
    if (new Date(today) > new Date(endDate)) {
        return "CheckOut"
    }
}