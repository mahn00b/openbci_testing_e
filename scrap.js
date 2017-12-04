const {Cyton} = require('openbci');
const BCIConstants = require('openbci-utilities').Constants;
const ourBoard = new Cyton({verbose:true, hardset: true, simulate: true});

const resyncPeriodMin = 5; // re sync every five minutes
const secondsInMinute = 60;
let sampleRate = BCIConstants.OBCISampleRate250; // Default to 250, ALWAYS verify with a call to `.sampleRate()` after 'ready' event!


ourBoard.connect(BCIConstants.OBCISimulatorPortName)
    .then(function () {
        ourBoard.on('ready', function () {

            ourBoard.softReset();
            ourBoard.usingVersionTwoFirmware();
            ourBoard.streamStart();


            ourBoard.on('error', err => {
                console.log(err);
            });

            ourBoard.on('sample', sample => {
                // Resynchronize every every 5 minutes
                if (sample._count % (sampleRate * resyncPeriodMin * secondsInMinute) === 0) {
                    ourBoard.syncClocksFull()
                        .then(syncObj => {
                            // Sync was successful
                            if (syncObj.valid) {
                                // Log the object to check it out!
                                console.log(`syncObj`, syncObj);

                                // Sync was not successful
                            } else {
                                // Retry it
                                console.log(`Was not able to sync, please retry?`);
                            }
                        });
                }
            });

            ourBoard.on('synced', sample => {

                console.log(sample.timeStamp);
            })

        })
            .catch(err => {
                console.log(`connect: ${err}`);
            });


    });