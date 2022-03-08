var controller = {
    timeCal: function (time) {
        let timeSplit = time.split(' ');
        let timeInMinutes = 0;
    
        if(timeSplit[1] === 'AM') {
            let timeArr = timeSplit[0].split(':');
    
            let hours = parseInt(timeArr[0]);
            let minutes = parseInt(timeArr[1]); 
    
            timeInMinutes = (hours === 12) ? minutes : (hours * 60) + minutes;
    
        } else if(timeSplit[1] === 'PM') {
            let timeArr = timeSplit[0].split(':');
    
            let hours = parseInt(timeArr[0]);
            let minutes = parseInt(timeArr[1]); 
    
            timeInMinutes = (hours === 12) ? (hours * 60 + minutes) : ((hours) * 60) + minutes; //21:00 PM 
        }
    
        return timeInMinutes;
    }
};

module.exports = controller;

