/*******************************************************************************
 * Copyright (c) 2011 IBM Corporation and others All rights reserved. This
 * program and the accompanying materials are made available under the terms of
 * the Eclipse Public License v1.0 which accompanies this distribution, and is
 * available at http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors: IBM Corporation - initial API and implementation
 ******************************************************************************/
/*global dojo console handleGetAuthenticationError */

/** @namespace The global container for eclipse APIs. */
var eclipse = eclipse || {};

eclipse.GitService = (function() {
	/**
	 * @class Provides operations on Git.
	 * @name eclipse.GitService
	 */
	function GitService(serviceRegistry) {
		if (serviceRegistry) {
			this._serviceRegistry = serviceRegistry;
			this._serviceRegistration = serviceRegistry.registerService(
					"IGitService", this);
			var self = this;
			serviceRegistry.getService("ISshService").then(function(sshService){
				self._sshService = sshService;
			});
		}
	}

	GitService.prototype = /** @lends eclipse.GitService.prototype */
	{
		checkGitService : function() {
			var service = this;
			console.info("Git Service checked");
		},
		cloneGitRepository : function(gitName, gitRepoUrl, gitSshUsername, gitSshPassword, gitSshKnownHost, privateKey, passphrase) {
			var postData = {};
			if(gitName){
				postData.Name = gitName;
			}
			postData.GitUrl=gitRepoUrl;
			if(gitSshUsername){
				postData.GitSshUsername = gitSshUsername;
			}
			if(gitSshPassword){
				postData.GitSshPassword = gitSshPassword;
			}
			if(gitSshKnownHost){
				postData.GitSshKnownHost = gitSshKnownHost;
			}
			if(privateKey) postData.GitSshPrivateKey=privateKey;
			if(passphrase) postData.GitSshPassphrase=passphrase;			
			
				return dojo.xhrPost({
					url : "/git/clone/",
					headers : {
						"Orion-Version" : "1"
					},
					postData : dojo.toJson(postData),
					handleAs : "json",
					timeout : 15000,
					load : function(jsonData, secondArg) {
						return jsonData;
					},
					error : function(error, ioArgs) {
						handleGetAuthenticationError(this, ioArgs);
						console.error("HTTP status code: ", ioArgs.xhr.status);
					}
				});
			
		},
		
		getDiffContent: function(diffURI , onLoad , onError){
			var service = this;
			dojo.xhrGet({
				url: diffURI , 
				headers: {
					"Orion-Version": "1"
				},
				content: { "parts": "diff" },
				handleAs: "text",
				timeout: 15000,
				load: function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error: function(response, ioArgs) {
					if(onError)
						onError(response,ioArgs);
					handleGetAuthenticationError(this, ioArgs);
					return response;
				}
			});
		},
		
		getDiffFileURI: function(diffURI , onLoad , onError){
			dojo.xhrGet({
				url: diffURI , 
				headers: {
					"Orion-Version": "1"
				},
				content: { "parts": "uris" },
				handleAs: "json",
				timeout: 15000,
				load: function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error: function(response, ioArgs) {
					if(onError)
						onError(response,ioArgs);
					handleGetAuthenticationError(this, ioArgs);
					return response;
				}
			});
		},
		
		getGitStatus: function(url , onLoad , onError){
			dojo.xhrGet({
				url: url , 
				headers: {
					"Orion-Version": "1"
				},
				handleAs: "json",
				timeout: 15000,
				load: function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error: function(response, ioArgs) {
					if(onError)
						onError(response,ioArgs);
					handleGetAuthenticationError(this, ioArgs);
					return response;
				}
			});
		},
		
		stage: function(location , onLoad , onError){
			dojo.xhrPut({
				url: location , 
				headers: {
					"Orion-Version": "1"
				},
				handleAs: "json",
				timeout: 15000,
				load: function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error: function(response, ioArgs) {
					if(onError)
						onError(response,ioArgs);
					handleGetAuthenticationError(this, ioArgs);
					return response;
				}
			});
		},
		
		unstage: function(location , onLoad , onError){
			dojo.xhrPost({
				url: location , 
				headers: {
					"Orion-Version": "1"
				},
				handleAs: "json",
				timeout: 15000,
				postData: dojo.toJson({"Reset":"MIXED"} ),
				load: function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error: function(response, ioArgs) {
					if(onError)
						onError(response,ioArgs);
					handleGetAuthenticationError(this, ioArgs);
					return response;
				}
			});
		},
		
		commitAll: function(location , message , body ,  onLoad , onError){
			dojo.xhrPost({
				url: location , 
				headers: {
					"Orion-Version": "1"
				},
				handleAs: "json",
				timeout: 15000,
				postData: body,
				load: function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error: function(response, ioArgs) {
					if(onError)
						onError(response,ioArgs);
					handleGetAuthenticationError(this, ioArgs);
					return response;
				}
			});
		},
		
		getGitClone : function(gitCloneURI, onLoad) {
			var service = this;
			
			return dojo.xhrGet({
				url : gitCloneURI,
				headers : {
					"Orion-Version" : "1"
				},
				handleAs : "json",
				timeout : 5000,
				load : function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error : function(error, ioArgs) {
					handleGetAuthenticationError(this, ioArgs);
					console.error("HTTP status code: ", ioArgs.xhr.status);
				}
			});
		},
		doGitLog : function(gitLogURI, onLoad) {
			var service = this;
			
			console.info("doGitLog called");
			
			return dojo.xhrGet({
				url : gitLogURI,
				headers : {
					"Orion-Version" : "1"
				},
				handleAs : "json",
				timeout : 5000,
				load : function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData.Children, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData.Children);
					}
					
					return jsonData.Children;
				},
				error : function(error, ioArgs) {
					handleGetAuthenticationError(this, ioArgs);
					console.error("HTTP status code: ", ioArgs.xhr.status);
				}
			});
		},
		getDiff : function(gitDiffURI, commitName, onLoad) {
			var service = this;
			
			console.info("getDiff called");
			
			dojo.xhrPost({
				url : gitDiffURI,
				headers : {
					"Orion-Version" : "1"
				},
				postData : dojo.toJson({
					"New" : commitName
				}),
				handleAs : "json",
				timeout : 5000,
				load : function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error : function(error, ioArgs) {
					handleGetAuthenticationError(this, ioArgs);
					console.error("HTTP status code: ", ioArgs.xhr.status);
				}
			});
		},
		doFetch : function(gitRemoteBranchURI, onLoad, gitSshUsername, gitSshPassword, gitSshKnownHost) {
			var service = this;
			
			console.info("doFetch called");
			
			return dojo.xhrPost({
				url : gitRemoteBranchURI,
				headers : {
					"Orion-Version" : "1"
				},
				postData : dojo.toJson({
					"Fetch" : "true",
					"GitSshUsername" : gitSshUsername,
					"GitSshPassword" : gitSshPassword,
					"GitSshKnownHost" : gitSshKnownHost
				}),
				handleAs : "json",
				timeout : 5000,
				load : function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error : function(error, ioArgs) {
					handleGetAuthenticationError(this, ioArgs);
					console.error("HTTP status code: ", ioArgs.xhr.status);
				}
			});
		},
		doMerge : function(gitHeadURI, commitName, onLoad) {
			var service = this;
			
			console.info("doMerge called");
			
			return dojo.xhrPost({
				url : gitHeadURI,
				headers : {
					"Orion-Version" : "1"
				},
				postData : dojo.toJson({
					"Merge" : commitName
				}),
				handleAs : "json",
				timeout : 5000,
				load : function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error : function(error, ioArgs) {
					handleGetAuthenticationError(this, ioArgs);
					console.error("HTTP status code: ", ioArgs.xhr.status);
				}
			});
		},
		doPush : function(gitBranchURI, srcRef, onLoad, gitSshUsername, gitSshPassword, gitSshKnownHost) {
			var service = this;
			
			console.info("doPush called");
			
			return dojo.xhrPost({
				url : gitBranchURI,
				headers : {
					"Orion-Version" : "1"
				},
				postData : dojo.toJson({
					"PushSrcRef" : srcRef,
					"GitSshUsername" : gitSshUsername,
					"GitSshPassword" : gitSshPassword,
					"GitSshKnownHost" : gitSshKnownHost
				}),
				handleAs : "json",
				timeout : 5000,
				load : function(jsonData, secondArg) {
					if (onLoad) {
						if (typeof onLoad === "function")
							onLoad(jsonData, secondArg, secondArg);
						else
							service._serviceRegistration.dispatchEvent(onLoad,
									jsonData);
					}
				},
				error : function(error, ioArgs) {
					handleGetAuthenticationError(this, ioArgs);
					console.error("HTTP status code: ", ioArgs.xhr.status);
				}
			});
		},
		getLog : function(gitCommitURI, commitName, onLoad) {
			var service = this;
			
			console.info("getLog called");
			
			return dojo.xhrPost({
				url : gitCommitURI,
				headers : {
					"Orion-Version" : "1"
				},
				postData : dojo.toJson({
					"New" : commitName
				}),
				handleAs : "json",
				timeout : 5000,
				load : function(jsonData, secondArg) {
					return secondArg.xhr.getResponseHeader("Location");
				},
				error : function(error, ioArgs) {
					handleGetAuthenticationError(this, ioArgs);
					console.error("HTTP status code: ", ioArgs.xhr.status);
				}
			}).then(function(scopedGitCommitURI){
				dojo.xhrGet({
					url : scopedGitCommitURI,
					headers : {
						"Orion-Version" : "1"
					},
					handleAs : "json",
					timeout : 5000,
					load : function(jsonData, secondArg) {
						if (onLoad) {
							if (typeof onLoad === "function")
								onLoad(jsonData.Children, secondArg);
							else
								service._serviceRegistration.dispatchEvent(onLoad,
										jsonData.Children);
						}
						return jsonData.Children;
					},
					error : function(error, ioArgs) {
						handleGetAuthenticationError(this, ioArgs);
						console.error("HTTP status code: ", ioArgs.xhr.status);
					}
				});
			});	
		},
		getDefaultRemoteBranch : function(gitRemoteURI, onLoad) {
			var service = this;
			
			console.info("getDefaultRemoteBranch called");
			
			dojo.xhrGet({
				url : gitRemoteURI,
				headers : {
					"Orion-Version" : "1"
				},
				handleAs : "json",
				timeout : 5000,
				load : function(jsonData, secondArg) {
					return jsonData;
				},
				error : function(error, ioArgs) {
					handleGetAuthenticationError(this, ioArgs);
					console.error("HTTP status code: ", ioArgs.xhr.status);
				}
			}).then(function(remoteJsonData){
				dojo.xhrGet({
					url : remoteJsonData.Children[0].Location,
					headers : {
						"Orion-Version" : "1"
					},
					handleAs : "json",
					timeout : 5000,
					load : function(jsonData, secondArg) {
						if (onLoad) {
							if (typeof onLoad === "function")
								onLoad(jsonData.Children[0], secondArg);
							else
								service._serviceRegistration.dispatchEvent(onLoad,
										jsonData.Children[0]);
						}
						return jsonData;
					},
					error : function(error, ioArgs) {
						handleGetAuthenticationError(this, ioArgs);
						console.error("HTTP status code: ", ioArgs.xhr.status);
					}
				});
			});	
		}
	};
	return GitService;
}());
