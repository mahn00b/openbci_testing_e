/*
* This file can contain utility functions we can
* use and constant variables that are used
* across the whole app. - Mahn00b
* */
module.exports.Core_Utilies = {


    Constants : {
        CONSTANT_EXAMPLE: 212,
        PORTS: {
            ADAMS_PORT_0: '/dev/tty.usbserial-DQ0081A9',
            MACS_PORT_0: 'COM3'
        }

    },

    example_function: function() {
        console.log("This is an example, let me print a constant ", this.Constants.CONSTANT_EXAMPLE);
        return "return this random string as an example";
    }

};