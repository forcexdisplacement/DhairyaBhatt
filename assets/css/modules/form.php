<?php

     if(isset($_POST['btn-send']))
     {
        $UserName = $_POST  ['UName'];
        $Email = $_POST  ['Email'];
        $Message = $_POST  ['Message'];
        
        if(empty($UserName) || empty($Email)  ||  empty($Message))
        {
            header('location:index.html?error');
        }

        else{
            header('location:index.html?success')
            $to ="innovationclubdhairya@gmail.com";
            (mail($to,$UName,$Email,$Message))
            create_function(success)
        }
    }

?>