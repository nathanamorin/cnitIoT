<?php

$fi = new FilesystemIterator(".", FilesystemIterator::SKIP_DOTS);

$re="[";
foreach ($fi as $key => $value) {

	$re =  $re . '"' . substr($value,2) . '"' . ",";
}

 $re = substr($re,0,-1);

 $re = $re .  "]";

printf($re);

?>