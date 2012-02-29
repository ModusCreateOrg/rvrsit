/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/4/12
 * Time: 9:04 AM
 * To change this template use File | Settings | File Templates.
 */

function rpc(method, config) {
	config = config || {};
	Ext.Ajax.request({
		method: 'POST',
		url: '/rpc',
		params: Ext.apply(config.params || {}, { method: method }),
		success: function(response) {
			config.handler && config.handler(Ext.decode(response.responseText));
		}
	});
};
