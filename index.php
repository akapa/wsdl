<!DOCTYPE html>

<style>
	textarea { width: 95%; height: 300px; }
</style>

<textarea id="xsd"><?=file_get_contents('wsdl/BudgetService_schema1.xsd');?></textarea>
<textarea id="show"></textarea>

<script src="js/lib/require.js" data-main="js/main.js"></script>