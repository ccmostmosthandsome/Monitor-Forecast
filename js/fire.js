(function ($) {
    var defaluts = {width: 200, height: 200};
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 6000 * 6);
        };
    })();
    $.fn.extend({
        "drawFlame": function (options) {
            var opts = $.extend({}, defaluts, options);
            this.each(function () {
                var $this = $(this);
                $this.width(opts.width).height(opts.height);
                var surface = $this.get(0).getContext("2d");
                surface.scale(2, 1);
                var particle = function () {
                    this.speed = {x: -1 + Math.random() * 2, y: -5 + Math.random() * 5};
                    this.location = {x: opts.width / 2 - 25, y: (opts.height / 2 + 35)};
                    this.radius = .5 + Math.random() * 1;
                    this.life = 10 + Math.random() * 10;
                    this.death = this.life;
                    this.r = 255;
                    this.g = Math.round(Math.random() * 155);
                    this.b = 0;
                };
                var particles = [];
                var particle_count = 100;
                for (var i = 0; i < particle_count; i++) {
                    particles.push(new particle());
                }
                var ParticleAnimation = function () {
                    surface.globalCompositeOperation = "source-in";
                    surface.fillStyle = "transparent";
                    surface.fillRect(0, 0, opts.width, opts.height);
                    surface.globalCompositeOperation = "lighter";
                    for (var i = 0; i < particles.length; i++) {
                        var p = particles[i];
                        surface.beginPath();
                        p.opacity = Math.round(p.death / p.life * 100) / 100;
                        var gradient = surface.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
                        gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
                        gradient.addColorStop(0.3, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
                        gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
                        surface.fillStyle = gradient;
                        surface.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
                        surface.fill();
                        p.death--;
                        p.radius++;
                        p.location.x += (p.speed.x);
                        p.location.y += (p.speed.y);
                        if (p.death < 0 || p.radius < 0) {
                            particles[i] = new particle();
                        }
                    }
                    requestAnimFrame(ParticleAnimation);
                };
                ParticleAnimation();
            });
        }
    });
})(jQuery);