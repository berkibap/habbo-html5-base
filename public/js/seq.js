var Sequencer = (function($) {
    var _api = {},
        _seq = {},
        _seqCount = 0,
        _seqCallback = {};

    function doAnimation(count, step) {
        var data = _seq[count][step],
            props = {};

            props[data.property] = data.value

        $(data.id).animate(props, data.duration, function() {
            if (step+1 < _seq[count].length) {
                doAnimation(count, ++step);
            } else {
                if (typeof _seqCallback[count] === "function") {
                    _seqCallback[count]();
                }
            }
        });
    }

    _api.buildSequence = function(id, property, initial, steps) {
        var newSeq = [],
            step = {
                id: id,
                property: property,
                initial: initial
            };

        $.each(steps, function(idx, s) {
            step = {};
            if (idx == 0) {
                step.initial = initial;
            }
            step.id = id;
            step.property = property;
            step.value = s.value;
            step.duration = s.duration;
            newSeq.push(step);
        });

        return newSeq;
    }

    _api.initSequence = function (seq) {
        $.each(seq, function(idx, s) {              
            if (s.initial !== undefined) {
                var prop = {};
                prop[s.property] = s.initial;
                $(s.id).css(prop);
            }            
        });
    }

    _api.initSequences = function () {
        $.each(arguments, function(i, seq) {
            _api.initSequence(seq);
        });
    }

    _api.runSequence = function (seq, callback) {
        //if (typeof seq === "function") return;
        _seq[_seqCount] = [];
        _seqCallback[_seqCount] = callback;

        $.each(seq, function(idx, s) {

            _seq[_seqCount].push(s);
            if (s.initial !== undefined) {
                var prop = {};
                prop[s.property] = s.initial;
                $(s.id).css(prop);
            }

        });


        doAnimation(_seqCount, 0);
        _seqCount += 1;
    }

    _api.runSequences = function() {
        var i = 0.
            args = arguments,
            runNext = function() {
                if (i+1 < args.length) {
                    i++;
                    if (typeof args[i] === "function") {
                        args[i]();
                        runNext();
                    } else {
                        _api.runSequence(args[i], function() {
                            runNext();
                        });
                    }
                }
            };

        // first we need to set the initial values of all sequences that specify them
        $.each(arguments, function(idx, seq) {
            if (typeof seq !== "function") {
                $.each(seq, function(idx2, seq2) {
                    if (seq2.initial !== undefined) {
                        var prop = {};
                        prop[seq2.property] = seq2.initial;
                        $(seq2.id).css(prop);
                    }
                });
            }

        });

        _api.runSequence(arguments[i], function (){
            runNext();
        });

    }

    return _api;
}(jQuery));