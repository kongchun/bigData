import React from 'react';
import {
	Link
} from 'react-router';
import CollectList from "./CollectList";
import Weixin from '../Weixin';
class Collection extends React.Component {
	render() {
		Weixin.getUrl();
		Weixin.weixinReady();
		return (<div>
		    <CollectList />
		</div>)
	}
}
export default Collection;
