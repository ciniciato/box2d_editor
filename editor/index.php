<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui" />
        
        <link rel="stylesheet" href="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/mdl/material.min.css">
        <script src="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/mdl/material.min.js"></script>

        <script src="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/lib/jquery/jquery.js"></script>
        <script src="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/lib/jquery/jquery-ui.min.js"></script>
        <link rel="stylesheet" href="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/lib/jquery/jquery-ui.structure.min.css">
        <link rel="stylesheet" href="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/lib/jquery/jquery-ui.theme.min.css">
        <link rel="stylesheet" href="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/lib/jquery/jquery-ui.min.css">

        <link rel="stylesheet" href="style.css">
        <script src="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/lib/Box2dWeb.min.js"></script>
        <script src="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/classes/box2d.js"></script>
    </head>

    <body>
        <?php include 'controls.php'; ?>
        <script src="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/classes/world.js"></script>
        <script src="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/classes/debugDraw.js"></script>
        <script src="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/classes/objects.js"></script>
        <script src="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/classes/tools.js"></script>
        <script src="https://raw.githubusercontent.com/ciniciato/box2d_editor/master/src/classes/utils.js"></script>
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
                debugDraw.draw();
            }
        </script>
    </body>
</html>
 