const DataMain = require('./main.js');
const data = DataMain.structuredData;
const fs = require('fs');

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function findCourse(courseCode) {
    return data.some(module => module.module === courseCode);
}

function findGroup(courseCode, groupCode) {
    const module = data.find(m => m.module === courseCode);
    return module && module.classes.some(c => c.group === groupCode);
}

function PrintGroupsAvailable(courseCode) {
    const module = data.find(m => m.module === courseCode);
    if (module && module.classes.length > 0) {
        console.log(`\nGroupes disponibles pour ${courseCode}:`);
        module.classes.forEach(group => {
            console.log(`${group.group}: ${group.day} ${group.start}-${group.end} (${group.room})`);
        });
    } else {
        console.log(`Pas de groupes disponibles pour ${courseCode}`);
    }
}

function checkTimeConflict(dict_courses_selected, newModule) {
    for (const courseGroups of Object.values(dict_courses_selected)) {
        for (const existingGroup of courseGroups) {
            if (existingGroup.classes.day === newModule.classes.day) {
                const existingStart = timeToMinutes(existingGroup.classes.start);
                const existingEnd = timeToMinutes(existingGroup.classes.end);
                const newStart = timeToMinutes(newModule.classes.start);
                const newEnd = timeToMinutes(newModule.classes.end);
                
                if (newStart < existingEnd && existingStart < newEnd) {
                    return {
                        conflict: true,
                        message: `Conflit avec ${existingGroup.module} ${existingGroup.classes.group} (${existingGroup.classes.day} ${existingGroup.classes.start}-${existingGroup.classes.end})`
                    };
                }
            }
        }
    }
    return { conflict: false };
}

function findGroupModule(courseCode, groupCode) {
    const module = data.find(m => m.module === courseCode);
    if (!module) return null;
    
    const groupInfo = module.classes.find(c => c.group === groupCode);
    if (!groupInfo) return null;
    
    return {
        module: courseCode,
        classes: groupInfo
    };
}

function generateICalendar(dict_courses_selected) {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Custom Classroom Schedule//EN\n";
    
    const dayMap = {
        'L': '20240108',
        'MA': '20240109',
        'ME': '20240110',
        'J': '20240111',
        'V': '20240112',
        'S': '20240113'
    };

    for (const [course, groups] of Object.entries(dict_courses_selected)) {
        for (const group of groups) {
            const formattedTime = time => time.replace(':', '') + '00';
            const startTime = formattedTime(group.classes.start);
            const endTime = formattedTime(group.classes.end);
            const date = dayMap[group.classes.day];

            icsContent += `BEGIN:VEVENT\n`;
            icsContent += `UID:${course}-${group.classes.group}-${date}\n`;
            icsContent += `SUMMARY:${course} - ${group.classes.group}\n`;
            icsContent += `DTSTART:${date}T${startTime}\n`;
            icsContent += `DTEND:${date}T${endTime}\n`;
            icsContent += `LOCATION:${group.classes.room}\n`;
            icsContent += `END:VEVENT\n`;
        }
    }
    
    icsContent += "END:VCALENDAR";

    try {
        fs.writeFileSync('personal_schedule.ics', icsContent, 'utf8');
        console.log('Fichier iCalendar généré: personal_schedule.ics');
    } catch (error) {
        console.error('Erreur lors de la création du fichier iCalendar:', error);
    }
}

module.exports = {
    findCourse,
    findGroup,
    PrintGroupsAvailable,
    findGroupModule,
    generateICalendar,
    checkTimeConflict
};