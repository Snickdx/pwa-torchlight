import React, { Component } from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	content: {
		flexGrow: 1,
		paddingTop: '45vh'
	},
	paper: {
		padding: theme.spacing.unit * 2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
	},
	button: {
		margin: theme.spacing.unit,
	},
	input: {
		display: 'none',
	},
});

function UserException(message) {
	this.message = message;
	this.name = 'UserException';
}

class App extends Component {
	
	state = {
		lightToggle: false,
		track: null
	};
	
	setupPhotoState = async () =>{
		if('mediaDevices' in navigator) {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const cameras = devices.filter((device) => device.kind === 'videoinput');
			
			if (cameras.length === 0) {
				throw new UserException("no devices detected!");
			}
			const camera = cameras[cameras.length - 1];
			
			// Create stream and get video track
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					deviceId: camera.deviceId,
					facingMode: ['user', 'environment'],
					height: {ideal: 1080},
					width: {ideal: 1920}
				}
			});
			
			this.setState({"track":stream.getVideoTracks()[0]});
			
			// const photoCapabilities = await (new ImageCapture(this.state.track)).getPhotoCapabilities();
			
		}
	};
	
	constructor(props){
		super(props);
		this.classes = props.classes;
		this.setupPhotoState();
	}
	
	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
		try{
			if( 'mediaDevices' in navigator){
				this.state.track.applyConstraints({
					advanced: [{torch: true}]
				});
			}else{
				alert("Camera Flash Not Supported!");
			}
		}catch(e){
			console.log(e);
		}
	};
	
	
	render() {
		return (
			<div className={this.classes.root}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="title" color="inherit">
							Torchlight
						</Typography>
					</Toolbar>
				</AppBar>
				<div className={this.classes.content}>
					<Grid container spacing={24} alignItems={'center'} direction={'row'} justify={"center"}>
						
						<FormControlLabel
							control={
								<Switch
									checked={this.state.lightToggle}
									onChange={this.handleChange('lightToggle')}
									value="lightToggle"
									color="primary"
								/>
							}
							label="Toggle Light"
						/>
						
					</Grid>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(App);
