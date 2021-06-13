# FM-RDS
a simple implementation of FM RDS in Javascript, 

I am currently working with a USB FM tuner and required the use of the "Radio Data System", this is what displays the current station and misc text they broadcast, I also see timestamp and application data but have not implemented those interfaces

usage

var rdsObject = new rds();<br />
/*<br />
  Sender is the RDS object itself<br />
  Text is the text that has just been modified<br />
  Target:<br />
    text - text sent by the station, may include weather reports etc.<br />
    station - normally the name of the radio station<br />
*/<br />

/* Update function will only be called on an actual change to the text */<br />
rdsObject.onUpdate(function(sender, text, target){ console.log(target+": "+text); });<br />

in the callback of the RDS request on the USB device

in my case

setInterval(function()<br />
{<br />
  usbdevice.put(this.put([0x03, tuner_band.FM, 0x82, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], function()<br />
  {<br />
    /* arguments[1] being an array of uShort representing Group A, Group B, Group C, Group D */<br />
    rdsObject._rds.analyseframes(arguments[1]);<br />
  });<br />
}, 50);
