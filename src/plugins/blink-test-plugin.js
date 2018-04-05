jsPsych.plugins['blink-test'] = (function(){

    var plugin = {};

    plugin.info = {
        name: 'blink-test',
        parameters: {
            samples: 5, //number of blinks to take
            interval: 5, //number of intervals
            sample_duration:1, //time to keep light on
            randomized: false,//allow random intervals
            toggle_light:0,//constant to toggle light
            light_on: "#fc9c92",//bright light color
            light_off : "#8c554f"//dark light color
        }
    };



    plugin.trial = function(display_element, trial){



        //Arguments for this library are sent via JSON on JSpsych initialization


        //Functions to be called on events

        //on start experiment
        if(typeof trial.onStart === "function") plugin.info.parameters.onStart = trail.onStart;

        //on light trial
        if(typeof  trial.onSample === "function")  plugin.info.parameters.onSample = trial.onSample;

        //on light trial
        if(typeof  trial.onSample === "function")  plugin.info.parameters.onComplete = trial.onComplete;

        //on complete experiment
        if(typeof trial.onFinish === "function") plugin.info.parameters.onFinish = trial.onFinish;


        //TODO: FIX RANDOMIZED INTERVAL
        plugin.info.parameters.sample_duration = trial.sample_duration || 1;//time for blink light on
        plugin.info.parameters.num_trials = trial.num_trials || 5;//number of trials to take
        plugin.info.parameters.random_interval = false;//if set to true then time between trials will be random
        plugin.info.parameters.time_interval = trial.time_interval || 3;//time interval between trials if not random



       var element =  '<h2 class="text-center">When the test begins, you will see a circle light up<br></h2>'
            + '<h2 class="text-center">(as seen below)</h2>'
           + ' <br><div id="circle" class="circle"></div><br> '
           +  '<div class="text-center">We will take ' + plugin.info.parameters.samples + ' samples</div><br>'
            + '<div class="text-center">'+'Press Next To Start'
            + '<button id="blink-next" class="jspsych-btn">Next &gt;</button></div>';


       //element to display content
       display_element.append(element);


        var light_timer = setInterval(toggleLight, 500);//toggle light every half second as an example

        //event handler for the "next" button click
        $('#blink-next').click(function(e){


            clearInterval(light_timer);//clear example timer
            if(plugin.toggle_light === 1) toggleLight();//if light is on turn it off
            display_element.empty();//empty instruction contents

            //building test element and append to display
            element = '<br><div id="circle" class="circle"></div>'
                        +'<div class="text-center">Trials Left: <p id="num-trials">'+ plugin.info.parameters.samples +'</p></div>';
            display_element.append(element);

            //create a time interval
            var time = plugin.info.parameters.time_interval * 1000;

            //if time is randomized we will be a random time between 1 and chosen time_interval
            if(plugin.info.parameters.randomized) time = randomTime(plugin.info.parameters.time_interval);

            //time next trial
            setTimeout(performTrial, time);
        });




    };


    /*
    * peformTrial - this function starts a trial by turning the light on, and executing the
    *               onSample() option.
    * @return VOID
    * */
    function performTrial(){


        toggleLight();//turn light on


        if(typeof plugin.info.parameters.onSample === 'undefined'){
            //this will execute if event handler was not assigned
            console.log("sample this");

        }else plugin.info.parameters.onSample();//run custom event handler


        //use sample_duration to hold the light on for a certain amount of time
        setTimeout(endTrial, plugin.info.parameters.sample_duration*1000);

    }


    /*
     * endTrial - this function is called after trial is performed for the sample duration.
     *            It ends the current trial and deducts 1 from the total amount of trials
     * @return VOID
     * */
    function endTrial(){

        toggleLight();//turn light off

        plugin.info.parameters.num_trials--;//deduct number of trials left
        $("#num-trials").text(plugin.info.parameters.num_trials);
        //if there are no more trials left end JsPsych Experiment
        if(plugin.info.parameters.num_trials === 0) jsPsych.endExperiment("Trials over");
        else{

            //create a new time from the time_interval
            var time = plugin.info.parameters.time_interval * 1000;
            //if randomized get a random time
            if(plugin.info.parameters.random_interval) time = randomTime(plugin.info.parameters.time_interval);

            //set timer for next trial
            setTimeout(performTrial, time);



        }


    }


    /*
     * toggleLight - Changes color for circle html element
     * @return void
     * */
    function toggleLight() {
        $('#circle').css("background", (plugin.info.parameters.toggle_light ?  plugin.info.parameters.light_off: plugin.info.parameters.light_on));
        plugin.info.parameters.toggle_light = (plugin.info.parameters.toggle_light === 0 ? 1 : 0);
    }

    /*
    * randomTime - picks a random time between 1 and n seconds, for random samples
    * @param time parameter to define n number of seconds to choose from
    * @return millisecond time.
    * */
    function randomTime(time=5){
        time = Math.floor(Math.random() * Math.floor(time));
        return time*1000;
    }

    return plugin;

})();
