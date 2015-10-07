<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui" />
        
        <link rel="stylesheet" href="mdl/material.min.css">
        <script src="mdl/material.min.js"></script>

        <script src="lib/jquery/jquery.js"></script>
        <script src="lib/jquery/jquery-ui.min.js"></script>
        <script src="lib/jquery/colResizable.min.js"></script>
        <link rel="stylesheet" href="lib/jquery/jquery-ui.structure.min.css">
        <link rel="stylesheet" href="lib/jquery/jquery-ui.theme.min.css">
        <link rel="stylesheet" href="lib/jquery/jquery-ui.min.css">

        <link rel="stylesheet" href="style.css">
        <script src="lib/Box2dWeb.min.js"></script>
        <script src="classes/box2d.js"></script>
    </head>

    <body>
        <?php include 'controls.php'; ?>
        <script src="classes/world.js"></script>
        <script src="classes/debugDraw.js"></script>
        <script src="classes/objects.js"></script>
        <script src="classes/tools.js"></script>
        <script src="classes/utils.js"></script>
        <script>
            debugDraw.set();
            ground = Box2d.create_box({x: 50, y: 15}, {width: 100, height: 1}, {type: b2Body.b2_staticBody});
            loop();
            
            var lastTime = Date.now(), deltaTime;

            function loop() {
                deltaTime = (new Date().getTime() - lastTime)/1000;
                lastTime = Date.now();
                
                requestAnimationFrame(loop);
                World.update();
                //if (debugDraw.Pointer.hasMoved)
                {
                    debugDraw.draw();
                }
            }
        </script>
    </body>
</html>
 