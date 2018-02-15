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


        // if any trial variables are functions
        // this evaluates the function and replaces
        // it with the output of the function
        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);




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

        });








        jsPsych.finishTrial();
    };



    function performTest(){

        toggleLight();


        if(typeof plugin.parameters.onSample === 'undefined'){

            console.log("sample this");

        }else plugin.parameters.onSample();

        setTimeout(nextTrial, )

    }


    function nextTrial(){

    }


    /*
     * toggleLight - Changes color for circle html element
     * @return void
     * */
    function toggleLight() {
        $('#circle').css("background", (plugin.toggle_light ?  plugin.light_off: plugin.light_on));
        plugin.toggle_light = (plugin.toggle_light%2 - 1);
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