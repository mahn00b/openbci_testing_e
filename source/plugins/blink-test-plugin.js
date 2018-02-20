jsPsych.plugins['blink-test'] = (function(){

    var plugin = {};

    plugin.info = {
        name: 'blink-test',
        parameters: {
            samples: 5, //number of blinks to take
            interval: 5, //number of intervals
            sampling_time:2, //time to
            randomized: false,
            toggle_light:0,
            light_on: "#fc9c92",
            light_off : "#8c554f"
        }
    };



    plugin.trial = function(display_element, trial){



        //Arguments for this library are sent via JSON on JSpsych initialization

        //optional callback arguments to call when sampling subject
        if(typeof  trial.onSample === "function")  plugin.info.parameters.onSample = trial.onSample;


        plugin.info.parameters.sample_duration = trial.sample_duration || 1;//time for blink light on
        plugin.info.parameters.num_trials = trial.num_trials || 5;//number of trials to take
        plugin.info.parameters.random_interval = trial.random_interval === true;//if set to true then time between trials will be random
        plugin.info.parameters.time_interval = trial.time_interval || 3;//time interval between trials if not random


       var element =  'When the test begins, you will see a circle light up(as seen below)'
           + ' <br><div id="circle" class="circle"></div><br> '
           +  'We will take ' + plugin.info.parameters.samples + ' samples'
            + 'Press Next To Start'
            + "<button id='blink-next' class='jspsych-btn'>Next &gt;</button></div>";


       display_element.append(element);


        var light_timer = setInterval(toggleLight, 1000);//toggle light every second as an example

        $('#blink-next').click(function(e){
            clearInterval(light_timer);
            if(plugin.toggle_light) toggleLight();
            display_element.innerHTML = "";
            element = '<br><div id="circle" class="circle"></div><br> '
                        +'Trials Left: <p id="num-trials">'+ plugin.info.parameters.samples +'</p>';
            display_element.append(element);

            var time = plugin.info.parameters.time_interval * 1000;

            if(plugin.info.parameters.random_interval) time = randomTime(plugin.info.parameters.time_interval);

            setTimeout(performTrial, time);
        });




    };



    function performTrial(){

        toggleLight();


        if(typeof plugin.info.parameters.onSample === 'undefined'){

            console.log("sample this");

        }else plugin.info.parameters.onSample();



        setTimeout(endTrial, plugin.info.parameters.sampling_time);

    }



    function endTrial(){

        toggleLight();

        plugin.info.parameters.num_trials--;


        if(plugin.info.parameters.num_trials === 0) jsPsych.endExperiment("Trials over");
        else{


            var time = plugin.info.parameters.time_interval * 1000;

            if(plugin.info.parameters.random_interval) time = randomTime(plugin.info.parameters.time_interval);

            setTimeout(performTrial, time);



        }


    }





    function nextTrial(){

    }


    /*
     * toggleLight - Changes color for circle html element
     * @return void
     * */
    function toggleLight() {
        $('#circle').css("background", (plugin.info.parameters.toggle_light ?  plugin.info.parameters.light_off: plugin.info.parameters.light_on));
        plugin.info.parameters.toggle_light = (plugin.info.parameters.toggle_light%2 - 1);
    }

    /*
    * randomTime - picks a random time between 1 and n seconds, for random samples
    * @param time parameter to define n number of seconds to choose from
    * @return millisecond time.
    * */
    function randomTime(time=5){
        time = Math.floor(Math.random() * Math.floor(time));
        return time;
    }

    return plugin;

})();