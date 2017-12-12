
function EEG =  OpenBCIDATA(file,writefile)
    [ALLEEG EEG CURRENTSET ALLCOM] = eeglab;
    RAWDATA = dlmread(file,",");
    Data = RAWDATA(6:rows(RAWDATA),2:9);
    idx = NA(size(Data(:,:)));
    Data{:,:}(idx) = 0;
    MyArr = transpose(table2array(Data));;
    EEG=pop_importdata('setname','test','data',MyArr,'dataformat', ...
                       'array','pnts',height(Data),'chanlocs',<channel_location_file>,'nbchan',8, ...
                   'xmin',0,'srate',250);
        
    [ALLEEG EEG CURRENTSET ] = eeg_store(ALLEEG, EEG);
    EEG = pop_eegfilt( EEG, 1, 0, [], [0]);
    
nevents = length(EEG.event);
for index = 1 : nevents
	if ischar(EEG.event(index).type) && strcmpi(EEG.event(index).type, 'square')
		EEG.event(end+1) = EEG.event(index);
		EEG.event(end).latency = EEG.event(index).latency - 0.1*EEG.srate; 
		EEG.event(end).type = 'cue'; '% Make the type of the new event '
	end;
end;
 
EEG = eeg_checkset(EEG, 'eventconsistency');
[ALLEEG EEG CURRENTSET] = eeg_store(ALLEEG, EEG, CURRENTSET);

[ALLEEG EEG CURRENTSET] = pop_newset(ALLEEG, EEG, CURRENTSET, 'setname', 'Continuous EEG Data');
EEG = pop_reref( EEG, [], 'refstate',0);

EEG = pop_rmbase( EEG, [0 1000]);
[ALLEEG EEG CURRENTSET] = pop_newset(ALLEEG, EEG, CURRENTSET, 'setname', 'Continuous EEG Data epochs', 'overwrite', 'on');  


EEG = pop_runica(EEG,'chanind',[1 2 3 4 5 6 7 8]);

[ALLEEG EEG CURRENTSET] = pop_newset(ALLEEG, EEG, CURRENTSET, ...
                                     'setname', writefile, 'overwrite', 'on');  

pop_saveset(EEG,'filename',writefile,'filepath',<data_path>);

[ALLEEG EEG CURRENTSET] = eeg_store(ALLEEG, EEG, CURRENTSET);
