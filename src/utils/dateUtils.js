export const parseDate = (dateString) => {
  const parts = dateString.split("/")
  if (parts.length === 3) {
    return new Date(parts[2], parts[1] - 1, parts[0])
  }
  return new Date(0)
}

export const formatTimeToHHMM = (timeString) => {
  if (!timeString) return ''

  // Check if it's already in HH:mm format
  if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
    return timeString
  }

  // Attempt to parse and format if not already HH:mm
  try {
    // Create a dummy date to parse the time
    const dummyDate = new Date(`2000-01-01T${timeString}`);
    if (isNaN(dummyDate.getTime())) {
      // If parsing with T fails, try without T (for formats like "2:30 PM")
      const [time, modifier] = timeString.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') {
        hours = '00';
      }
      if (modifier && modifier.toLowerCase() === 'pm') {
        hours = parseInt(hours, 10) + 12;
      }
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    return dummyDate.toTimeString().slice(0, 5);
  } catch (error) {
    console.error("Error formatting time:", timeString, error);
    return timeString; // Return original if parsing fails
  }
}