// based on https://en.wikipedia.org/wiki/Radio_Data_System#Message_version_B

function rds()
{
	this._radiotextabflag = null;
	this._text =    '';
	this._station = '';
	this._oldtext = '';
	this._oldstation = '';	
	this._onUpdateText = null;
	this._onUpdateStation = null;
	this.onUpdate(function(){  });
	this.clear();
};

rds.prototype.clear = function()
{
	this._radiotextabflag = null;
	this._text =    '                                                                                                ';
	this._station = '                                                                                                ';
	this._oldtext = this._text;
	this._oldstation = this._station;
	this._onUpdateText(this, '', 'text');
	this._onUpdateText(this, '', 'station');
};

rds.prototype.onUpdate = function()
	{ if(arguments.length){ this.onUpdateText(arguments[0]).onUpdateStation(arguments[0]); return this; }; return this._onUpdate; };

rds.prototype.onUpdateText = function()
	{ if(arguments.length){ this._onUpdateText = arguments[0]; return this; }; return this._onUpdateText; };

rds.prototype.onUpdateStation = function()
	{ if(arguments.length){ this._onUpdateStation = arguments[0]; return this; }; return this._onUpdateStation; };

rds.prototype.replace = function(src, index, text)
	{ return src.substr(0, index) + text + src.substr(index + text.length); };

rds.prototype.pair = function(src)
	{ var result = {l:src >> 8, r:src & 0xFF}; result.chrs = String.fromCharCode(result.l)+String.fromCharCode(result.r); result.failed = (result.l<0x20||result.l>0x7F||result.r<0x20||result.r>0x7F); return result; };

rds.prototype.analyseframes = function()
{
	switch(arguments[0][2]&0xf800)
	{		
		case 0x0000:
			if((pair = this.pair(arguments[0][4])).failed)return;
			if(this._oldstation!=(this._station = this.replace(this._station, (arguments[0][2]&0x3)*2, pair.chrs)))
				{ this._onUpdateStation(this, (this._oldstation = this._station).trim(), 'station'); };
			break;

		case 0x2000:
			if((pair1 = this.pair(arguments[0][3])).failed)return;
			if((pair2 = this.pair(arguments[0][4])).failed)return;
			if((abFlag = ((arguments[0][2] >> 4) & 0x1) == 1)!=this._radiotextabflag)
				{ this._text =    '                                                                                                '; this._radiotextabflag = abFlag; }
			else
				this._text = this.replace(this._text, (arguments[0][2] & 0xf) * 4, pair1.chrs+pair2.chrs);

			if(this._oldtext!=this._text)
				this._onUpdateText(this, (this._oldtext = this._text).trim(), 'text');

			break;

		case 0x3000:
			//console.log('application'); why? whats this application stuff?
			break;

		case 0x4000:
			//console.log('timestamp'); not going to bother with timestamps
			break;
	};
	return this;
};
