import MathUtil from './math-util';

    describe('linear interpolation based on the following formula. Interpolates between from and to by the fraction t', function() {

        it('a = 20 b = 80 t = .5 then lerp should equal 50', function() { 
            let lerp = MathUtil.lerp(.5,20,80);
            expect(lerp).to.equal(50);
        });

        it('a = 20 b = 80 t = 0 then lerp should equal 20', function() { 
            let lerp = MathUtil.lerp(0,20,80);
            expect(lerp).to.equal(20);
        });

        it('a = 20 b = 80 t = 1 then lerp should equal 80', function() { 
            let lerp = MathUtil.lerp(1,20,80);
            expect(lerp).to.equal(80);
        });

    });    
    describe('sine easing based on the simple linear tweening', function() {

        it('t= 1, so nothing should happen - it is at end', function() { 
            let sinEasing = MathUtil.sinEasing(1);
            expect(sinEasing).to.equal(1);
        });

        it('t= .25, so should return .1465 - according to p98 of book', function() { 
            let sinEasing = MathUtil.sinEasing(.25);
            expect(sinEasing.toFixed(3)).to.equal('0.146');
        });

        it('t= .75, so should return .8535 - according to p98 of book', function() { 
            let sinEasing = MathUtil.sinEasing(.75);
            expect(sinEasing.toFixed(3)).to.equal('0.854');
        });

   

    });  