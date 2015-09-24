/**
 * Provides access to the endpoint which contains the data.
 */
export default function API ($http, $q, $timeout){



  var s = {};
  s.get = function(url, params, options) {
    return $http.get(url, angular.extend({}, {params: params}, options));
  };
  s.post = function(url, data, options) {
    return $http.post(url, data, options);
  };
  s.wrapQ = function(promise) {
    var deferred = $q.defer();
    promise.then(deferred.resolve, deferred.reject);
    return deferred.promise;
  };

  /**
   * @namespace Common
   * @memberof API
   */

  /**
   * @typedef {object} JsonResponse
   * @property {boolean} success - true on success, false on error
   * @property {?string} message - if error, the client-friendly message describing the reason for the error
   * @property {?type} data - if success, any data to be returned from the api call
   * @property {?number} fileId - UNKNOWN
   * @property {?number} id - UNKNOWN
   * @property {?string} dataAsString - string-escaped contents of data
   * @memberof API.Common
   */

  /**
   * @typedef {object} UploadResponse
   * @property {string} name - name of the file
   * @property {number} size - bytes successfully transferred
   * @property {string} type - the content type (e.g. image/jpeg, application/octet-stream)
   * @memberof API.Common
   */

  /**
   * Timestamp measured as the number of milliseconds since the unix epoch
   * (00:00:00 UTC Thu Jan 1, 1970).  Also known as unix time or POSIX time.
   * @typedef {number} Timestamp
   * @memberof API.Common
   */

  /**
   * A lightweight object encapsulating simple key-value pair information
   * suitable for typeaheads or multi-choice selectors
   * @typedef {object} Result
   * @property {number} id - id of the typeahead result
   * @property {string} name - name of the typeahead result
   * @property {object} metadata - lightweight metadata associated with this result
   * @memberof API.Common
   */

  /**
   * Notation helper for associative array from typeA -> typeB
   * @typedef {object} Map
   * @memberof API.Common
   */

  /**
   * Pagination results for an arbitrary list of objects
   * @typedef {object} PaginationStruct
   * @property {number} count - The total number of results across all pages
   * @property {type|array.<type>} results - The array of type results on the requested
   *   page or an object which may be converted into such an array
   * @memberof API.Common
   */

  /**
   * Object encapsulating a user's identity
   * @typedef {object} User
   * @property {number} id
   * @property {API.Common.Department} department
   * @property {string} userName
   * @property {string} firstName
   * @property {string} lastName
   * @property {string} name
   * @property {string} email
   * @property {number} groupId
   * @property {number} dirUserId
   * @property {number} primaryAclId
   * @property {API.Common.Timestamp} creationDate
   * @property {number} deleted
   * @memberof API.Common
   */

  /**
   * Object encapsulating an organizational department
   * @typedef {object} Department
   * @property {number} id
   * @property {string} name
   * @memberof API.Common
   */

  /**
   * @typedef {object} RepositoryFolder
   * @property {number} id
   * @property {string} name
   * @property {number} parentFolderId
   * @property {string} virtualFolderPath
   * @property {number} dirObjectId
   * @property {number} numberOfChildFolders
   * @property {API.Common.Timestamp} creationDate
   * @property {?API.Common.Timestamp} deletionDate
   * @property {array.<API.Common.RepositoryDocument>} docList
   * @property {string} vehicleName
   * @memberof API.Common
   */

  /**
   * @typedef {object} RepositoryDocument
   * @property {number} id
   * @property {string} name
   * @property {API.Common.RepositoryDocument.id} parentFolderId
   * @property {number} dirObjectId
   * @property {number} locked
   * @property {UNKNOWN} lockOwner
   * @property {UNKNOWN} documentFile
   * @property {UNKNOWN} documentFileDesc
   * @property {API.JobJacket.Comments.Comment} primaryComment
   * @property {array.<API.JobJacket.Comments.Comment>} commentList
   * @property {UNKNOWN} documentTypeList
   * @property {API.Common.Revision} latestRevision
   * @property {?number} pageNum
   * @property {string} extension
   * @property {(API.Common.Revision.id|number)} latestRevisionId
   * @property {number} revisionCount
   * @property {number} commentCount
   * @property {boolean} hasComment
   * @memberof API.Common
   */

  /**
   * @typedef {object} Revision
   * @property {number} id
   * @property {?string} name
   * @property {API.Common.RepositoryDocument.id} documentId
   * @property {number} revisionNumber
   * @property {number} dirObjectId
   * @property {number} archived
   * @property {API.Common.Timestamp} creationDate
   * @property {API.Common.Timestamp} lastAccessDate
   * @property {number} filesize
   * @property {number} softproofLock
   * @property {UNKNOWN} volume
   * @property {string} filetype
   * @property {string} filename
   * @property {string} author
   * @property {number} annoCompleted
   * @property {number} signoffCompleted
   * @property {UNKNOWN} scheduleLock
   * @property {array.<API.Common.Version>} revPreviewList
   * @memberof API.Common
   */

  /**
   * @typedef {object} Version
   * @property {number} revpreviewId
   * @property {API.Common.Revision.id} revisionId
   * @property {number} previewTypeId
   * @property {number} pagenumber
   * @property {string} volume
   * @property {string} filename
   * @property {number} width
   * @property {number} height
   * @memberof API.Common
   */

  /**
   * @typedef {object} DocumentApprovers
   * @property {API.Common.RepositoryDocument.id} documentId - documentId the approver is assigned to
   * @property {array.<API.Common.Approver>} approvers - list of approvers and approval metadata
   * @memberof API.Common
   */

  /**
   * @typedef {object} Approver
   * @property {API.Common.User} user - user assigned for signoff
   * @property {?timestamp} remindedAt - timestamp of last reminder
   * @property {?timestamp} approvedAt - timestamp of signoff or empty/null if not signed off
   * @memberof API.Common
   */

  /**
   * API module for Job Jacket and Media Repository
   * @namespace JobJacket
   * @memberof API
   */
  s.JobJacket = {
    /**
     * Overview of the Job Jacket or Media Repository folder's documents
     * @namespace Overview
     * @memberof API.JobJacket
     */
    Overview: {
      /**
       * Retrieves the list of documents for the specified Job Jacket vehicle or Media Repository folder
       * @param {number} folderId - The vehicle id (for Job Jacket) or media repository folder id (for Media Repository)
       * @param {number} layoutId - The optional layout id for the vehicle (for Job Jacket), default base layout if 0, null, or undefined
       * @param {?number} pageIndex - The zero indexed page number
       * @param {?number} pageLength - The number of items displayed per page
       * @param {?object} filterParams - The filtering parameters for the Job Jacket vehicle or Media Repository folder
       * @param {?object} sortParams - The sorting parameters for the Job Jacket vehicle or Media Repository folder
       * @returns {API.Common.JsonResponse.<API.Common.PaginationStruct<API.Common.RepositoryFolder>>} The paged list of documents inside the containing folder structure
       * @memberof API.JobJacket.Overview
       */
      getOverview: function(requestObject) {
//        return s.get('/msm/ws/vehicle-version/' + folderId + '/doc-list', {
//        return s.get('json/jobjacket-mediarepository/server-grid.json', requestObject);
        return s.get('json/jobjacket-mediarepository/jj_pagination_overview.php', requestObject);
      },
      /**
       * Retrieves all the layouts for the vehicle aside from the base layout
       * @param {number} folderId - The Job Jacket vehicle id
       * @returns {API.Common.JsonResponse.<API.Common.Result>>} The list of layouts for the vehicle
       * @memberof API.JobJacket.Overview
       */
      getLayouts: function(folderId) {
        // return s.get('');
        return s.get('json/jobjacket-mediarepository/jj-layouts.json');
      },

      /**
       * Overview of the Job Jacket or Media Repository folder's documents
       * @namespace Actions
       * @memberof API.JobJacket.Overview
       */
      Actions: {
        /**
         * Deletes specified documents from the Job Jacket vehicle or Media Repository folder
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - The list of document ids to be deleted
         * @returns {API.Common.JsonResponse}
         * @memberof API.JobJacket.Overview.Actions
         */
        deleteDocs: function(documentIds) {
          // return s.post('', {
          return s.post('deleteDocs.json', {
            documentIds: documentIds
          });
        },
        /**
         * Merge specified documents from the Job Jacket vehicle or Media Repository folder using one document as the base version
         * @param {API.Common.RepositoryDocument.id} baseDocumentId - The document id to use as the base
         * @param {array.<API.Common.RepositoryDocument.id>} mergeDocumentIds - The list of document ids to be merged into the base
         * @returns {API.Common.JsonResponse<UNKNOWN>}
         * @memberof API.JobJacket.Overview.Actions
         */
        merge: function(baseDocumentId, mergeDocumentIds) {
          // return s.post('', {
          return s.post('merge.json', {
            baseDocumentId: baseDocumentId,
            mergeDocumentIds: mergeDocumentIds
          });
        },
        /**
         * Crop specified documents
         * @param {API.Common.Revision.id} revisionId - The revision id of the document to apply preview image cropping to
         * @param {number} widthInInches - The cropping width to remove from both sides of the preview image
         * @param {number} heightInInches - The cropping height to remove from both sides of the preview image
         * @returns {API.Common.JsonResponse<UNKNOWN>}
         * @memberof API.JobJacket.Overview.Actions
         */
        crop: function(revisionId, widthInInches, heightInInches) {
          // return s.post('', {
          return s.post('crop.json', {
            revisionId: revisionId,
            width: widthInInches,
            height: heightInInches
          });
        },
        /**
         * Moves the specified documents (e.g. ctrl+x, ctrl+v)
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds
         * @param {array.<API.Common.RepositoryFolder.id>} mediaRepositoryFolderId
         * @returns {API.Common.JsonResponse}
         * @memberof API.JobJacket.Overview.Actions
         */
        move: function(documentIds, mediaRepositoryFolderId) {
          // return s.post('', {
          return s.post('move.json', {
            documentIds: documentIds,
            mediaRepositoryFolderId: mediaRepositoryFolderId
          });
        },
        /**
         * Copies the specified documents (e.g. ctrl+c, ctrl+v)
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds
         * @param {array.<API.Common.RepositoryFolder.id>} mediaRepositoryFolderId
         * @returns {API.Common.JsonResponse}
         * @memberof API.JobJacket.Overview.Actions
         */
        copy: function(documentIds, mediaRepositoryFolderId) {
          // return s.post('', {
          return s.post('copy.json', {
            documentIds: documentIds,
            mediaRepositoryFolderId: mediaRepositoryFolderId
          });
        },
        /**
         * Reset cropping on the specified document previews
         * @param {API.Common.Revision.id|array.<API.Common.Revision.id>} revisionIds - The document revisions to reset preview cropping for
         * @returns {API.Common.JsonResponse<UNKNOWN>}
         * @memberof API.JobJacket.Overview.Actions
         */
        resetPreview: function(revisionIds) {
          // return s.post('', {
          return s.post('resetPreview.json', {
            revisionIds: revisionIds
          });
        },
        /**
         * Initiates a download of the specified files into a zip of the original source files
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - the documents to be downloaded
         * @param {array.<API.Common.RepositoryDocument.latestRevisionId>} revisionIds - the revision ids of the documents to be downloaded
         * @memberof API.JobJacket.Overview.Actions
         */
        downloadMultiSource: function(documentIds, revisionIds) {
          return s.get('/crosscap/servlet/Controller', {
            command: 'DownloadMulti',
            docIds: documentIds.join(','),
            revIds: revisionIds.join(',')
          });
          /*
            // Example: /crosscap/servlet/Controller?command=DownloadMulti&revIds=137351,137352,&docIds=134810,134811,
            window.location = "/crosscap/servlet/Controller?" + $.param({
              'command' : 'DownloadMulti',
              'docIds'  : checkedIds.join(',') + ',',
              'revIds'  : checkedRevisions.join(',') + ','
            });
          */
        },
        /**
         * Initiates a download of the specified documents as a single PDF
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - the documents to be downloaded
         * @param {array.<API.Common.RepositoryDocument.latestRevisionId>} revisionIds - the revision ids of the documents to be downloaded
         * @param {API.Common.RepositoryDocument.virtualPath} virtualPath - the virtual path for the documents to be downloaded
         * @param {number} [downloadType=0]
         * @memberof API.JobJacket.Overview.Actions
         */
        downloadMultiPdf: function(documentIds, revisionIds, virtualPath, downloadType) {
          return s.get('/crosscap/servlet/Controller', {
            command: 'DownloadMultiToPdf',
            docIds: documentIds.join(','),
            revIds: revisionIds.join(','),
            path: virtualPath,
            downloadType: 0
          });
          /*
            // Example: /crosscap/servlet/Controller?command=DownloadMultiToPdf&revIds=137351,137353,&docIds=134810,134812,&downloadType=0&path=/Testing/WM%20Test
            window.location = "/crosscap/servlet/Controller?" + $.param({
              'command' : 'DownloadMultiToPdf',
              'docIds'  : checkedIds.join(',') + ',',
              'revIds'  : checkedRevisions.join(',') + ',',
              'path'    : encodeURIComponent(docPath),
              'downloadType' : 0
            });
          */
        },
        /**
         * Initiates a download of a single document's original source file
         * @param {API.Common.RepositoryDocument.latestRevisionId} revisionId - the revision id of the document to be downloaded
         * @memberof API.JobJacket.Overview.Actions
         */
        downloadSingleSource: function(revisionId) {
          return s.get('/crosscap/servlet/Controller', {
            command: 'filetransfer.ServletDownloadRevision',
            revisionId: revisionId
          });
          /*
            // Example: /crosscap/servlet/Controller?command=filetransfer.ServletDownloadRevision&revisionId=137351
            window.location = "/crosscap/servlet/Controller?" + $.param({
              'command'    : 'filetransfer.ServletDownloadRevision',
              'revisionId' : doc.latestRevisionId
            });
          */
        },

        /**
         * Initiates a download of a single document as a pdf
         * @param {API.Common.RepositoryDocument.id} - the document id of the document to be downloaded
         * @param {API.Common.RepositoryDocument.filename} - the filename of the document to be downloaded
         * @param {API.Common.RepositoryDocument.virtualPath} - the virtual path of the document to be downloaded
         * @memberof API.JobJacket.Overview.Actions
         */
        downloadSinglePdf: function(documentId, filename, virtualPath) {
          return s.get('/crosscap/servlet/Controller', {
            command: 'GetMultipleDocPdf',
            docId: documentId,
            docName: filename,
            docLocation: virtualPath
          });
          /*
            // Example: /crosscap/servlet/Controller?command=GetMultipleDocPdf&docid=137351&docName=081813_TAB_pg01_Crosscap_180160.pdf&docLocation=/Testing/WM%20Test
            window.location = "/crosscap/servlet/Controller?" + $.param({
              'command'     : 'GetMultipleDocPdf',
              'docId'       : doc.id,
              'docName'     : encodeURIComponent(doc.filename),
              'docLocation' : encodeURIComponent(doc.virtualPath)
            });
          */
        },

        /**
         * Unlocked the specified documents for the specified duration
         * @param {(API.Common.RepositoryDocument.id|array.<API.Common.RepositoryDocument.id>)} documentIds - the documents to be unlocked
         * @param {number} unlockDays - The number of days before relocking
         * @param {number} unlockHours - The number of hours before relocking
         * @param {number} unlockMinutes - The number of minutes before relocking
         * @returns {API.Common.JsonResponse<UNKNOWN>}
         * @memberof API.JobJacket.Overview.Actions
         */
        unlock: function(documentIds, unlockDays, unlockHours, unlockMinutes) {
          // return s.post('', {
          return s.post('unlock.json', {
            ids: documentIds,
            days: unlockDays,
            hours: unlockHours,
            minutes: unlockMinutes
          });
        },

        /**
         * Delete the specified version in a document
         * @param {versionId} versionId - The id of the document version to be deleted
         * @returns {API.Common.JsonResponse}
         * @memberof API.JobJacket.Overview.Actions
         */
        deleteVersion: function(versionId) {
          // return s.post('', {
          return s.post('deleteversion.json', {
            versionId: versionId
          });
        },

        /**
         * @typedef {object} RepaginationStruct
         * @property {API.Common.RespositoryDocument.id} id
         * @property {string} filename
         * @property {number} pageNumber
         * @memberof API.JobJacket.Overview.Actions
         */

        /**
         * Rename and reassign page numbers for Job Jacket or Media Repository documents
         * @param {array.<API.JobJacket.Overview.Actions.RepaginationStruct>} documentChanges - the array of documents containing
         *   only the id, filename, and pageNumber properties needed for a repagination update
         * @returns {API.Common.JsonResponse<UNKNOWN>}
         * @memberof API.JobJacket.Overview.Actions
         */
        repaginate: function(documentChanges) {
          // return s.post('', {
          return s.post('repaginate.json', {
            docList: documentChanges
          });
        },
        /**
         * Initiates a popup window comparing the two selected documents
         * @param {API.Common.RepositoryDocument.id} documentId1 - the first document to compare
         * @param {API.Common.RepositoryDocument.id} documentId2 - the second document to compare
         * @memberof API.JobJacket.Overview.Actions
         */
        compareSelected: function(documentId1, documentId2) {
          console.log("Compare List Popup Window Stub", documentId1, documentId2);
        },
        /**
         * Initiates a export change form functionality #FIXME
         * @param {UNKNOWN} placeholder - PLACEHOLDER
         * @memberof API.JobJacket.Overview.Actions
         */
        exportChangeForm: function() {},
        /**
         * Initiates a popup window (for printing) or download of the specified documents
         * @param {UNKNOWN} placeholder - PLACEHOLDER
         * @memberof API.JobJacket.Overview.Actions
         */
        exportSummary: function() {},
        /**
         * Initiates a popup window for editting metadata for a document
         * @param {UNKNOWN} placeholder - PLACEHOLDER
         * @memberof API.JobJacket.Overview.Actions
         */
        enterMetadata: function() {},
        /**
         * Initiates a popup window for (soft)proofing
         * @param {API.Common.RepositoryDocument} doc - document to open for (soft)proofing
         * @memberof API.JobJacket.Overview.Actions
         */
        enterProof: function(doc) {
/* FIXME: placeholder data, this values are either injected or missing */
var vehicleData = window.vehicleData || { vehicleVersionId: 123456789 };
var new_w = window.new_w || 800;
var new_h = window.new_h || 600;

          // alert("openedWindows size is "+parent.openedWindows.length);
          //Added the if condition temporarily to fix a js erro in softproffing that occurs with the new gui.
          //Added by Filmon G. July 20, 2011
          //Also initialized the windowname to 0.
          var x=3;
          var y=3;
          var windowname = 0;
          var opened = parent.openedWindows;
          if(opened != null) {
            if(opened.length <2) {
              windowname = opened.length;
            } else if(opened[1].closed) { //parent.openedWindows.length==2
              windowname = 1;
            }
            if(windowname == 1) {
              x=20;
              y=20;
            }
          }

          var url = '/msm/vehicle/flex-softproving';
          var os = navigator.platform;
          var urlParams = {
            imageId: doc.latestRevisionId,
            filename: doc.filename,
            documentId: doc.id,
            //PS-880 14/03/12 -jtai added vehicle version id to the parameters
            //var extraParam = '&startPos=${param.startPos }&pageSize=${param.pageSize }&direction=${param.direction }&path=${param.path }&vehicleVersionId=' + vehicleVersionId;
//            var extraParam = '&vehicleVersionId=' + vehicleData.vehicleVersionId;
            vehicleVersionId: vehicleData.vehicleVersionId
          };
          var fullUrl = url + "?" + angular.element.param(urlParams);
          if(os.indexOf("Mac") >= 0) {
            var specs = 'x='+x+',y='+y+',width=1000,height=900, resizable=1';
            var toolWindow = window.open(fullUrl, windowname, specs, false);
            toolWindow.resizeTo(new_w,new_h);
          } else {
            var specs = 'x='+x+',y='+y+',width=920, height=700, status=no, toolbar=no,resizable=yes';
            var toolWindow = window.open(fullUrl, windowname, specs, false);
          }
        }
      }
    },

    /**
     * Media Repository tree view
     * @namespace MediaRepository
     * @memberof API.JobJacket
     */
    MediaRepository: {
      /**
       * @typedef {object} MediaRepositoryNode
       * @property {string} title - the folder name
       * @property {API.Common.RepositoryFolder.id} key - folder id of the media repository folder
       * @property {boolean|undefined} isLazy - true if the node has children that should be lazily loaded
       * @property {array.<API.JobJacket.MediaRepository.MediaRepositoryNode>|undefined} children - array containing children
       *   of this node or undefined if isLazy is true
       * @memberof API.JobJacket.MediaRepository
       */

      /**
       * Retrieves all nodes whose distance from the specified node's root path is at most one.
       * Retrieved nodes that contain children not meeting this criteria are have isLazy set true to
       * indicate loading of that node's children is deferred until user interaction with that folder.
       * Note the data object (i.e. root folder) is a forest of trees (i.e. folder nodes).
       * <pre>
       * // Example response if id=2 (note: immediate children are
       * // expanded) or id=4 (note: has no children) were expanded
       * {
       *    "data": [{
       *        "title": "Node 1",
       *        "key": 1
       *    }, {
       *        "title": "Node 2",
       *        "key": 2,
       *        "children": [{
       *            "title": "Node 3",
       *            "key": 3,
       *            "isLazy": true
       *        }, {
       *            "title": "Node 4",
       *            "key": 4
       *        }]
       *    }, {
       *        "title": "Node 5",
       *        "key": 5,
       *        "isLazy": true
       *    }, {
       *        "title": "Node 6",
       *        "key": 6
       *    }],
       *    "success": true
       * }
       * </pre>
       * @param {?number} mediaRepositoryFolderId - The folder display as pre-selected.  If undefined, retrieves the root folder.
       * @returns {API.Common.JsonResponse<array.<API.JobJacket.MediaRepository.MediaRepositoryNode>>}
       * @memberof API.JobJacket.MediaRepository
       */
      getInitialFolder: function(mediaRepositoryFolderId) {
        // return s.get('', {
        return s.get('json/jobjacket-mediarepository/mr_test_api.php', {
          initFolderId: mediaRepositoryFolderId
        }, { cache: false });
      },
      /**
       * Retrieves immediate children nodes of the specified node.  Children that have children of their own
       * instead have their isLazy property set true instead of populating their children property.
       * Note the data object (i.e. selected folder) is a forest of trees (i.e. child nodes or pruned folders)
       * @param {number} MediaRepositoryFolderId - The folder to expand and retrieve children information for
       * @returns {API.Common.JsonResponse<array.<API.JobJacket.MediaRepository.MediaRepositoryNode>>}
       *   Response object containing an array of the immediate children of the specified node
       * @memberof API.JobJacket.MediaRepository
       */
      getIncrementalFolder: function(mediaRepositoryFolderId) {
        // return s.get('', {
        return s.get('json/jobjacket-mediarepository/mr_test_api.php', {
          folderId: mediaRepositoryFolderId
        }, { cache: false });
      },
      Actions: {
        /**
         * Renames the specified media repository folder
         * @param {API.Common.RepositoryFolder.id} mediaRepositoryFolderId - id of the folder to rename
         * @param {string} folderName - new folder name
         * @returns {API.Common.JsonResponse}
         */
        renameFolder: function(mediaRepositoryFolderId, folderName) {
          return s.post('mr-rename.json', {
            folderId: mediaRepositoryFolderId,
            folderName: folderName
          });
        },
        /**
         * Deletes the specified media repository folder
         * @param {API.Common.RepositoryFolder.id} mediaRepositoryFolderId - id of the folder to delete
         * @returns {API.Common.JsonResponse}
         */
        deleteFolder: function(mediaRepositoryFolderId) {
          return s.post('mr-delete.json', {
            folderId: mediaRepositoryFolderId
          });
        },
        /**
         * Adds a new media repository folder under the specified folder
         * @param {API.Common.RepositoryFolder.id|null} - mediaRepositoryParentFolderId the parent folder id or null for the root folder
         * @param {string} folderName - new folder name
         * @returns {API.Common.JsonResponse<API.JobJacket.MediaRepository.MediaRepositoryNode>}
         */
        addFolder: function(mediaRepositoryParentFolderId, folderName) {
          return s.post('mr-addfolder.json', {
            parentFolderId: mediaRepositoryParentFolderId,
            folderName: folderName
          });
        }
      }
    },

    /**
     * Apply Workflow, Assign Proof, Schedule Lock, and Signoff List Modal functionality
     * @namespace Workflow
     * @memberof API.JobJacket
     */
    Workflow: {
      /**
       * @namespace ApplyWorkflow
       * @memberof API.JobJacket.Workflow
       */
      ApplyWorkflow: {
        /**
         * @typedef {object} Workflow
         * @property {number} id - id of the workflow
         * @property {string} name - name of the workflow
         * @property {array.<API.JobJacket.Workflow.ApplyWorkflow.WorkflowApprover>} approvers - the approver and their workflow start/end settings
         * @memberof API.JobJacket.Workflow.ApplyWorkflow
         */
        /**
         * @typedef {object} WorkflowApprover
         * @property {API.Common.User} approver - approver (user) for this workflow
         * @property {number} startWeek - week of the year (0-51) the workflow starts
         * @property {number} startDay - day of the week (0-6) the workflow starts
         * @property {number} startMinutes - minutes of the day (0-1439) the workflow starts
         * @property {number} endMinutes - duration of the workflow in minutes
         * @memberof API.JobJacket.Workflow.ApplyWorkflow
         */

        /**
         * Retrieves list of all workflows that may be applied in the Job Jacket or Media Repository
         * @returns {API.Common.JsonResponse<array.<API.Common.Result>>}
         * @memberof API.JobJacket.Workflow.ApplyWorkflow
         */
        getWorkflows: function() {
          // return s.get('', {
          return s.get('json/jobjacket-mediarepository/apply-workflows-search.json', {
          });
        },
        /**
         * Gets workflow details
         * @param {API.Common.Result.id} workflowId
         * @returns {API.Common.JsonResponse<API.JobJacket.Workflow.ApplyWorkflow.Workflow>}
         * @memberof API.JobJacket.Workflow.ApplyWorkflow
         */
        getWorkflow: function(workflowId) {
          // return s.get('', {
          return s.get('json/jobjacket-mediarepository/apply-workflow-selected.json', {
            workflowId: workflowId
          });
        },
        /**
         * Applies the selected workflow to each of the selected documents
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - list of documents to apply the workflow to
         * @param {API.JobJacket.Workflow.ApplyWorkflow.Workflow.id} workflowId - id of the workflow to apply
         * @returns {API.Common.JsonResponse<UNKNOWN>}
         * @memberof API.JobJacket.Workflow.ApplyWorkflow
         */
        applyWorkflow: function(documentIds, workflowId) {
          return s.post('applyworkflow.json', {
            documentIds: documentIds,
            workflowId: workflowId
          });
        },
        /**
         * Applies the selected workflow to all documents in the media repository folder
         * @param {API.Common.RepositoryFolder.id} folderId - media repository folder to apply the workflow to
         * @param {API.JobJacket.Workflow.ApplyWorkflow.Workflow.id} workflowId - id of the workflow to apply
         * @returns {API.Common.JsonResponse<UNKNOWN>}
         * @memberof API.JobJacket.Workflow.ApplyWorkflow
         */
        applyWorkflowFolder: function(folderId, workflowId) {
          return s.post('applyworkflowfolder.json', {
            folderId: folderId,
            workflowId: workflowId
          });
        }
      },
      /**
       * @namespace AssignProof
       * @memberof API.JobJacket.Workflow
       */
      AssignProof: {
        /**
         * Updates the proof cycle for the selected documents
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - ids of the documents to be updated
         * @param {number} proofStage - index of the proof cycle to update the status to.
         *   1: Pencil Proof, 2: First Proof, 3: Final Price Proof, 4: Confirmation, 5: At Printer
         * @returns {API.Common.JsonResponse}
         * @memberof API.JobJacket.Workflow.AssignProof
         */
        assignProof: function(documentIds, proofStage) {
          //return s.post('', {
          return s.post('assignproof.json', {
            documentIds: documentIds,
            proofStage: proofStage
          });
        }
      },
      /**
       * @namespace ScheduleLock
       * @memberof API.JobJacket.Workflow
       */
      ScheduleLock: {
        /**
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - list of document ids to apply locking to
         * @param {API.Common.Timestamp} lockTime - the locking time to apply to each of the documents
         * @returns {API.Common.JsonResponse<UNKNOWN>}
         * @memberof API.JobJacket.Workflow.ScheduleLock
         */
        lock: function(documentIds, lockTime) {
          // return s.post('', {
          return s.post('schedulelock.json', {
            documentIds: documentIds,
            lockTime: lockTime
          });
        }
      },
      /**
       * @namespace SignoffList
       * @memberof API.JobJacket.Workflow
       */
      SignoffList: {
        /**
         * Retrieves ids and labels for all the departments for this user's organization
         * @returns {API.Common.JsonResponse<array.<API.Common.Department>>}
         * @memberof API.JobJacket.Workflow.SignoffList
         */
        getDepartments: function() {
          // return s.get('', {
          return s.get('json/jobjacket-mediarepository/departments.json', {
          });
        },
        /**
         * Retrieves users that can be added to the document's signoff list
         * @param {string} keywords - string of keywords searching by first name, last name, and department
         * @param {?array.<API.Common.Department.id>} departmentIds - list of department ids to filter by (default no filtering if omitted or empty)
         * @returns {API.Common.JsonResponse<array.<API.Common.User>>}
         * @memberof API.JobJacket.Workflow.SignoffList
         */
        searchAvailable: function(keywords, departmentIds) {
          // return s.get('', {
          return s.get('json/jobjacket-mediarepository/signofflist-available.json', {
            keywords: keywords,
            departmentIds: departmentIds
          });
        },

        /**
         * Retrieves the list of approvers for the specified documents and their
         * approval and reminder state
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - document ids to retrieve approvers for
         * @returns {API.Common.JsonResponse<array.<API.Common.DocumentApprovers>>}
         * @memberof API.JobJacket.Workflow.SignoffList
         */
        getApprovers: function(documentIds) {
          // return s.get('', {
          return s.get('json/jobjacket-mediarepository/jj_signofflist.php', {
            documentIds: documentIds
          });
        },
        /**
         * Add users to the signoff lists of the selected documents
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - the documents to update signoff lists for
         * @param {array.<API.Common.User.id>} userIds - users to add to the signoff lists of the selected documents
         * @returns {API.Common.JsonResponse<array.<API.Common.DocumentApprovers>>}
         * @memberof API.JobJacket.Workflow.SignoffList
         */
        addToSignoffList: function(documentIds, userIds) {
          // return s.post('', {
          return s.post('addsignoff.json', {
            documentIds: documentIds,
            userIds: userIds
          });
        },
        /**
         * Remove users from the signoff lists of the selected documents
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - the documents to update signoff lists for
         * @param {array.<API.Common.User.id>} userIds - users to remove from the signoff lists of the selected documents
         * @returns {API.Common.JsonResponse<array.<API.Common.DocumentApprovers>>}
         * @memberof API.JobJacket.Workflow.SignoffList
         */
        removeFromSignoffList: function(documentIds, userIds) {
          // return s.post('', {
          return s.post('removesignoff.json', {
            documentIds: documentIds,
            userIds: userIds
          });
        },
        /**
         * Sends a reminder to the selected users about the selected documents
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - documents to remind the user of
         * @param {array.<API.Common.User.id>} userIds - users to send reminders to
         * @returns {API.Common.JsonResponse<array.<API.Common.DocumentApprovers>>}
         * @memberof API.JobJacket.Workflow.SignoffList
         */
        sendReminders: function(documentIds, userIds) {
          // return s.post('', {
          return s.post('sendreminder.json', {
            documentIds: documentIds,
            userIds: userIds
          });
        },

        /**
         * Resets the approvers for the selected documents.  For use when trying to view signoff list
         * on multiple documents with differing sets of approvers.
         * @param {array.<API.Common.RepositoryDocument.id>} documentIds - documents to reset approvers for
         * @returns {API.Common.JSONResponse<array.<API.Common.DocumentApprovers>>}
         * @memberof API.JobJacket.Workflow.SignoffList
         */
        resetApprovers: function(documentIds) {
          // return s.post('', {
          return s.post('resetapprovers.json', {
            documentIds: documentIds
          });
        }
      },
    },

    /**
     * @namespace Preview
     * @memberof API.JobJacket
     */
    Preview: {
      /**
       * Gets the jagged array of Document -> Revisions -> Versions information for the selected document
       * @param {API.Common.RepositoryDocument.id} documentId - id of the document to be previewed
       * @returns {API.Common.JsonResponse<array.<API.Common.Revision>>}
       * @memberof API.JobJacket.Preview
       */
      getPreviews: function(documentId) {
        // return s.get('/msm/ws/vehicle-version/' + documentId + '/rev-list', {
        return s.get('json/jobjacket-mediarepository/server-preview.json', {
          docId: documentId
        });
      },
      /**
       * Builds the url for a preview image given the image id and session token
       * @param {API.Common.PreviewVersion.id} imageId - id of the document version's preview image
       * @param {string} sessionId - the session token of the currently logged in user
       * @returns {string} url where the image may be retrieved
       */
      getPreviewImageUrl: function(imageId, sessionId) {
        var url = '/crosscap/servlet/Controller';
        var options = {
          command: 'DownloadFile',
          imageid: imageId,
          sessionid: sessionId
        };

        return url + '?' + angular.element.params;
      },
      /**
       * Saves the updated markets for the specified version
       * @param {API.Common.Version.id} versionId - version of the document to update markets for
       * @param {array.<API.Common.Result.id>} marketIds - new market assignments for this version
       * @returns {API.Common.JsonResponse}
       * @memberof API.JobJacket.Preview
       */
      manageMarkets: function(versionId, marketIds) {
        // return s.post('', {
        return s.post('managemarkets.json', {
          versionId: versionId,
          marketIds: marketIds
        });
      },
      /**
       * Saves the version with an updated file name
       * @param {API.Common.Version.id} versionId - version of the document to update the filename for
       * @param {string} filename - the new filename for the version
       * @returns {API.Common.JsonResponse}
       * @memberof API.JobJacket.Preview
       */
      updateVersionName: function(versionId, filename) {
        // return s.post('', {
        return s.post('updateversionname.json', {
          versionId: versionId,
          filename: filename
        });
      }
    },

    /**
     * Email Modal functionality
     * @namespace Email
     * @memberof API.JobJacket
     */
    Email: {
      /**
       * Requests a list of users given a search string within the Email modal inside Job Jacket / Media Repository
       * @param {string} searchString - The current typeahead entry for searching by first, last, or department name of the user
       * @returns {API.Common.JsonResponse<array.<API.Common.User>>}
       * @memberof API.JobJacket.Email
       */
      getTypeaheadResults: function(searchString) {
        // return s.get('', {
        return s.get('json/jobjacket-mediarepository/emailtypeahead.json', {
          search: searchString
        });
      },
      /**
       * Sends an email to the list of recipients within the Email modal inside Job Jacket / Media Repository
       * @param {number} folderId - The id of the current Job Jacket vehicle or Media Repository folder
       * @param {array.<API.Common.User.id>} searchRecipients - Array of user ids to send the email to
       * @param {Map.<API.Common.RepositoryDocument.id,array.<API.Common.User.id>>} documentRecipients - Array of user ids to send the email to
       * @param {string} subject - The subject line of the email
       * @param {string} message - The message body of the email
       * @memberof API.JobJacket.Email
       * @returns {API.Common.JsonResponse}
       */
      sendEmail: function(folderId, searchRecipients, documentRecipients, subject, message) {
        // return s.post('', {
        return s.post('send-email.json', {
          folderId: folderId,
          searchRecipients: searchRecipients,
          documentRecipients: documentRecipients,
          subject: subject,
          message: message
        });
      }
    },

    /**
     * @namespace Comments
     * @memberof API.JobJacket
     */
    Comments: {
      /**
       * @typedef {object} Comment
       * @property {number} id - id for this comment
       * @property {API.Common.User} user - user who made this comment
       * @property {string} comment - contents of this comment
       * @property {timestamp} created - creation timestamp for this comment
       * @property {?timestamp} modified - modification timestamp for this comment
       * @property {?array.<API.JobJacket.Comments.Comment>} responses - comments made in response to this comment
       * @memberof API.JobJacket.Comments
       */

      /**
       * Retrieves the thread of comments for the specified document
       * @param {API.Common.RepositoryDocument.id} documentId - id of the document to retrieve comments for
       * @returns {API.Common.JsonResponse<array.<API.JobJacket.Comments.Comment>>}
       * @memberof API.JobJacket.Comments
       */
      getComments: function(documentId) {
        //return s.get('', {
        return s.get('json/jobjacket-mediarepository/comments.json', {
          documentId: documentId
        });
       },
      /**
       * @param {API.JobJacket.Comments.Comment.id} commentId - id of the comment to update
       * @param {string} comment - new comment body to update to
       * @returns {API.Common.JsonResponse}
       * @memberof API.JobJacket.Comments
       */
      updateComment: function(commentId, comment) {
        // return s.post('', {
        return s.post('updatecomment.json', {
          commentId: commentId,
          comment: comment
        })
      },
      /**
       * Currently unimplemented
       * @returns {API.Common.JsonResponse}
       * @memberof API.JobJacket.Comments
       */
      deleteComment: function(commentId) {},
      /**
        * Adds a reply for the document under the commenting section
        * @param {API.Common.RepositoryDocument.id} documentId - id of the document to comment under
        * @param {?API.JobJacket.Comments.Comment.id} parentCommentId - id of the parent comment or null if it is a top level comment
        * @param {string} comment - comment body
        * @returns {API.Common.JsonResponse<API.JobJacket.Comments.Comment>} - returns the newly created comment object
        * @memberof API.JobJacket.Comments
        */
      postComment: function(documentId, parentCommentId, comment) {
        //return s.post('', {
        return s.post('postcomment.json', {
          documentId: documentId,
          parentCommentId: parentCommentId,
          comment: comment
        });
       }
    },

    /**
     * @namespace CompareList
     * @memberof API.JobJacket
     */
    CompareList: {
      /**
       * Retrieves the document information for the provided list of documents
       * @param {array.<API.Common.RepositoryDocument.id>} documentIds - the list of documents to retrieve
       * @param {number} pageIndex - zero-indexed page number
       * @param {number} pageLength - number of items to display per page
       * @param {?object} filterParameters - filtering parameters for the compare list documents
       * @param {?object} sortParameters - sorting parameters for the compare list documents
       * @returns {API.Common.JsonResponse<API.Common.PaginationStruct<API.Common.RepositoryFolder>>}
       * @memberof API.JobJacket.CompareList
       */
      getCompareList: function(requestObject) {
//        return s.get('', {
        return s.get('json/jobjacket-mediarepository/jj_pagination_overview.php', requestObject);
      }
    },

    /**
     * @namespace SignoffReport
     * @memberof API.JobJacket
     */
    SignoffReport: {
      /**
       * Retrieves the list of approvers for the specified documents and their
       * approval and reminder state
       * @param {number} folderId - The vehicle id (for Job Jacket) or media repository folder id (for Media Repository)
       * @param {array.<API.Common.RepositoryDocument.id>} documentIds - document ids to retrieve approvers for
       * @param {?number} pageIndex - The zero indexed page number
       * @param {?number} pageLength - The number of items displayed per page
       * @param {?object} filterParams - The filtering parameters for the Job Jacket vehicle or Media Repository folder
       * @param {?object} sortParams - The sorting parameters for the Job Jacket vehicle or Media Repository folder
       * @returns {API.Common.JsonResponse<API.Common.PaginationStruct<API.Common.DocumentApprovers>>}
       * @memberof API.JobJacket.SignoffReport
       */
      getSignoffsByDocuments: function(requestObj) {
        // return s.get('', {
        return s.get('json/jobjacket-mediarepository/jj_pagination_signoffreport_bydocuments.php', requestObj);
      },
      /**
       * @typedef {object} DocumentApproval
       * @property {number} id - id of the document the user was assigned to approve
       * @property {timestamp} remindedAt - timestamp when the user was reminded about this document
       * @property {timestamp} approvedAt - timestamp when the user approved this document
       * @memberof API.JobJacket.SignoffReport
       */
      /**
       * @typedef {object} UserApprovals
       * @property {API.Common.User} user - user assigned to approve the set of documents
       * @property {array.<API.JobJacket.SignoffReport.DocumentApproval>} documents - list of documents assigned to this user and their approval status
       * @memberof API.JobJacket.SignoffReport
       */
      /**
       * Gets the paged list of document approvals group by user for the set of documents
       * @property {API.Common.JsonResponse<API.Common.PaginationStruct<API.JobJacket.SignoffReport.UserApprovals>>}
       * @memberof API.JobJacket.SignoffReport
       */
      getSignoffsByUsers: function(requestObj) {
        // return s.get('', {
        return s.get('json/jobjacket-mediarepository/jj_pagination_signoffreport_byusers.php', requestObj);
      }
    },

    /**
     * @namespace AnnotationList
     * @memberof API.JobJacket
     */
    AnnotationList: {
      /**
       * Retrieves the list of version ids and filenames for this document
       * @param {API.Common.RepositoryDocument.id} documentId - the selected document to retrieve the version list for
       * @returns {API.Common.JsonResponse<array.<API.Common.Result>>} List of id to version filename mappings in ascending version order
       * @memberof API.JobJacket.AnnotationList
       */
      getVersionList: function(documentId) {
        // return s.get('', {
        return s.get('json/jobjacket-mediarepository/annotation-versions.json', {
          'documentId': documentId
        });
      },
      /**
       * @typedef {object} Annotation
       * @property {API.Common.User} user - user making the comment
       * @property {string} comment - comment for this annotation
       * @property {timestamp} createdAt - timestamp of the annotation
       * @property {?timestamp} completedAt - timestamp of when the annotation was fulfilled
       * @memberof API.JobJacket.AnnotationList
       */

      /**
       * Retrieves the paged list of annotations for the selected document version
       * @param {API.Common.Version.revpreviewId} versionId - version id of the document version to retrieve annotations for
       * @param {?number} pageIndex - The zero indexed page number
       * @param {?number} pageLength - The number of items displayed per page
       * @param {?object} filterParams - The filtering parameters for the Job Jacket vehicle or Media Repository folder
       * @param {?object} sortParams - The sorting parameters for the Job Jacket vehicle or Media Repository folder
       * @returns {API.Common.JsonResponse<API.Common.PaginationStruct<API.JobJacket.AnnotationList.Annotation>>}
       */
      getAnnotationList: function(requestObj) {
        // return s.get('', {
        return s.get('json/jobjacket-mediarepository/annotation-list.json', requestObj);
      },
      /**
       * Retrieves the list of users that annotated the specified document version
       * @param {API.Common.Version.revpreviewId} versionId - version id of the document version to retrieve users for
       * @returns {API.Common.JsonResponse<array.<API.Common.User>>} list of users
       */
      getAnnotationListUsers: function(versionId) {
        // return s.get('', {
        return s.get('json/jobjacket-mediarepository/annotation-users.json', {
          versionId: versionId
        });
      }
    },

    /**
     * @namespace ExportSummary
     * @memberof API.JobJacket
     */
    ExportSummary: {
      /**
       * Retrieves the list of available comment type files when exporting summary
       * @returns {API.Common.JsonResponse<array.<API.Common.Result>>} List of comment ids and their translation keys
       */
      getCommentTypes: function() {
        // return s.get('');
        return s.get('json/jobjacket-mediarepository/export-summary-comment-types.json');
      },

      /**
       * Exports a summary of the selected documents
       * @param {string} exportType - the type of summary export: 'pdf', 'singlepdf', 'print'
       * @param {API.Common.RepositoryDocument.id|array.<API.Common.RepositoryDocument.id>} documentIds - ids of documents to summarize
       * @param {API.Common.Revision.id|array.<API.Common.Revision.id>} revisionIds - ids of revisions to summarize
       * @param {string} path - the virtual path of the files
       * @param {string} historyType - whether annotation history is included: 'yes' or 'no'
       * @param {string} userType - user annotations to include: 'all', 'self', or 'no'
       * @param {string} commentType - types of comments to include: 'all' or 'selection'
       * @returns {UNKNOWN}
       * @memberof API.JobJacket.ExportSummary
       */
      exportSummary: function(exportType, documentIds, revisionIds, path, historyType, userType, commentType) {
        var commandTypes = {
          'pdf': 'GetPdf',          // tentative command mapping
          'singlepdf': 'UNKNOWN',
          'print': 'getAnnotatedImage'
        }

        // Possibly handle print-summary differently by opening a new window?

        // return s.get('', {
        return s.get('exportsummary.json', {
          command: commandTypes[exportType],
          documentIds: documentIds,
          revisionIds: revisionIds,
          path: path,
          historyType: historyType,
          userType: userType,
          commentType: commentType
        });
      }
    },

    /**
     * File single and multiple file uploader on the Overview page
     * @namespace MediaUploader
     * @memberof API.JobJacket
     */
    MediaUploader: {
      /**
       * Get the url for file uploads in JJ/MR as a string.
       * @returns {string}
       * @memberof API.JobJacket.MediaUploader
       */
      getUrl: function() {
        return "";
      }
      /**
       * Uploads user supplied file(s)
       * @param {API.Common.RepositoryFolder.id} folderId
       * @returns {array.<API.Common.UploadResponse>}
       * @memberof API.JobJacket.MediaUploader
       */
      // API call is handled by the library using a provided URL
    }
  };

  /**
   * @namespace Rfb
   * @memberof API
   */

   s.Rfb = {
    getBidDetails: function(channel, id) {
      //return s.post('json/rfb.getBidInfo.json', {
      return s.post('vehicle.requestBid.json.smd.getInfo.action', {
        space: {
          implType: channel,
          id: id
        }
      });
    },
    saveBidDetails: function(reqObj) {
      //return s.post('json/rfb.saveBidInfo.json', {
      return s.post('vehicle.requestBid.json.smd.saveInfo.action', {
        requestBid: reqObj
      });

    },
    getUsersForRFB: function(searchStr, cancelPromise) {
      //return s.post('json/rfb.getUsersForRFB.json', {
      /*
      return s.post('vehicle.requestBid.json.smd.searchUsers.action', {
        params : {
          searchString: searchStr
        }
      });
      */
      return s.get('vehicle.requestBid.json.smd.searchUsers.action', {
        searchString: searchStr
      }, {
        timeout: cancelPromise
      });
    }
  };

  /**
   * @namespace OfrMgr
   * @memberof API
   */

   s.OfrMgr = {
    getFormats: function() {
      return s.get('globalOffer.offerMgr.json.smd.loadRetailFormatList.action');
    },
    getChannels: function(retailFormatIds) {
      return s.get('globalOffer.offerMgr.json.smd.loadChannelList.action', { retailFormatIds: retailFormatIds });
    },
    getSbus: function() {
      return s.get('globalOffer.offerMgr.json.smd.loadSBUList.action');
    },
    getDepartments: function(sbuId) {
      return s.get('globalOffer.offerMgr.json.smd.loadDepartmentList.action', {sbuId: sbuId});
    },
    getOffers: function(reqObj) {
      return s.post('globalOffer.offerMgr.json.smd.getGlobalOfferList.action', {}, { params: reqObj });
    },
    getCalendarData: function() {
      return s.post('calendar.loadFiscalYearList.action');
    }
   };

  s.Gom = {
    OfferBasket: {
      getOfferBasket: function(requestObj) {
        return s.post("globalOffer.offerMgr.json.smd.loadOfferBasketListByMerchandiseHierarchy.action", requestObj, {
          params: {
            hierarchyId: requestObj.filterParams.hierarchyId
          }
        });
      },
      addOfferBasket: function(offerId) {
        // Match existing call
        return s.get("vehicle.promoMgr.printMedia.assignOfferToBasket.action", {
          offerId: offerId
        });
      },
      removeOfferBasket: function(offerIds) {
        return s.get("vehicle.promoMgr.printMedia.removeOffer.action", {
          source: "basket",
          data: JSON.stringify(angular.element.map(offerIds, function(ele, i) {
            return { offerId: ele }
          }))
        });
      },
      getHierarchyChildren: function(hierarchyId) {
        return s.post('vehicle.gom.get.hierarchy.nodes.action', {
          merchandiseHierarchy: { id: hierarchyId }
        });
      }
    },
    OfferPreview: {
      getStatus: function() {
        //return s.get('json/om/op.getStatuses.json');
        return s.get('vehicle.offers.getOfferReviewStatusJSON.action');
      },
      changeStatus: function(offerId, statusId) {
        if(statusId == null){
          statusId = -1;
        }
        return s.get('vehicle.offer.review.updateOfferReviewStatusByOffer.json.smd.action', {
          "offer.id": offerId,
          "status.id": statusId
        });
      },
      getOfferDetails: function(offerId) {
        return s.get('vehicle.offers.getOfferJSON.action', {"offer.id": offerId});
        //return s.get('json/om/op.getOfferDetails.json', {"offer.id": offerId});
      },
      getOfferMarkets: function(offerVersionId) {
        return s.get('vehicle.offers.getOfferVersionMarketJSON.action', {"offerVersionId": offerVersionId} );
        //return s.get('json/om/op.getOfferMkts.json', {"offerVersionId": offerVersionId} );
      }
    },
    Export: {
      getOffers: function(reqObj) {
        return s.post('globalOffer.offerMgr.exportGlobalOfferList.action', { params: reqObj });
      }
    }
  };

  /**
   * @namespace Rfc
   * @memberof API
   */
  s.Rfc = {
    getTranslationsUrl: function() {
      return 'rfc.getLabels.action';
    },

    /**
     * @namespace Table
     * @memberof API.Rfc
     */
    Table: {
      /**
       * @typedef {object} RfcChannel
       * @property {int} id - id of the channel
       * @property {string} name - name of the channel
       * @memberof API.Rfc.Table
       */


      /**
       * @typedef {object} RfcEntry
       * @property {int} rfcId - id of the RFC
       * @property {int} offerId - id of the RFC offer
       * @property {string} offerLocation - event manager label for the ad block
       * @property {API.Common.User} rfcSubmitter - user submitting the RFC
       * @property {array.<API.Rfc.Table.RfcChannel>} rfcChannel - channel the RFC vehicle exists in (global view only)
       * @property {timestamp} submittedOn - timestamp when the RFC was submitted
       * @property {int} commentsCount - number of comments for this RFC
       * @property {int} rfcStatusId - status of the RFC
       * @memberof API.Rfc.Table
       */


      /**
       * Get the table of RFCs for the current user
       * @param {API.Common.Vehicle.id} vehicleId
       * @returns {API.Common.JsonResponse<API.Common.PaginationStruct<API.RFC.Table.RfcEntry>>}
       * @memberof API.Rfc.Table
       */
      getVehicleTable: function(requestObj) {
        return s.post('vehicle.rfc.offerMgr.json.smd.loadRfcTabPage.action', requestObj);
      },

      getRfcComments: function(rfcId) {
        return s.post('vehicle.rfc.offerMgr.json.smd.getRfcCommentsByRfcId.action', {
          rfcDetail: {
            id: rfcId
          }
        });
      },
      exportRfcTable: function(requestObj) {
        var str = 'filterParams.vehicleVersion.id=' + requestObj.filterParams.vehicleVersion.id;
        angular.forEach(requestObj.filterParams.idList, function(ele, i) {
          str += '&filterParams.idList[' + i + ']=' + ele;
        });

        angular.element('<a/>').attr({
          href: 'vehicle.rfc.exportFile.excel.action?' + str,
        })[0].click();
      },
      declineRfc: function(rfcId, comment) {
        return s.post('vehicle.rfc.declined.json.smd.action', {
          rfcDetail: {
            id: rfcId,
            commentList: [{comment: comment}]
          }
        });
      },
      approveRfc: function(rfcId, comment) {
        return s.post('vehicle.rfc.approved.json.smd.action', {
          rfcDetail: {
            id: rfcId,
            commentList: [{comment: comment}]
          }
        });
      },
      cancelRfc: function(rfcId) {
        return s.post('vehicle.rfc.cancelled.json.smd.action', {
          rfcDetail: {
            id: rfcId,
            commentList: [{comment: 'RFC cancelled'}]
          }
        });
      },
      getRfcWatchers: function(requestObj) {
        return s.post('vehicle.rfc.offerMgr.json.smd.getCurrentWatchersByRfcId.action', {
          rfcDetail: {
            id: requestObj.rfcId
          }
        });
      },
      searchRfcWatchers: function(requestObj) {
        return s.post('vehicle.rfc.offerMgr.json.smd.getAddingWatchersByCriteria.action', {
          // no payload
        }, {
          params: {
            search: requestObj.search,
            limit: requestObj.limit
          }
        });
      },
      setRfcWatchers: function(rfcId, userIds) {
        return s.post('vehicle.rfc.offerMgr.json.smd.saveWatchersByRfcId.action', {
          rfcDetail: {
            id: rfcId
          }
        }, {
          params: {
            watcherUserIds: userIds.join(',')
          }
        });
      },
    },
    Admin: {
      sendbackRfcs: function(rfcIds, comment) {
        return s.post('vehicle.rfc.offerMgr.json.smd.sendBackRfc.action', {
          // FIXME: URL limit is undefined (practically speaking up to 2048
          //   characters after url-encoding since that is what IE implements).
          //   Mobile browsers/devices are highly fragmented and may depart
          //   from this in unexpected ways.  Also note that the associative array
          //   does not define an ordering and so may include the rfc ids after
          //   the comment which may then be truncated
          // TODO: Investigate how to retrieve request payload properties
          //   without creating a separate VO class for every composition of
          //   possible input parameters
        }, {
          params: {
            rfcIdList: rfcIds,
            comment: comment
          }
        });
      },
      executeRfcs: function(rfcIds, comment) {
        return s.post('vehicle.rfc.offerMgr.json.smd.executeRfc.action', {
          // FIXME: URL limit is undefined (practically speaking up to 2048
          //   characters after url-encoding since that is what IE implements).
          //   Mobile browsers/devices are highly fragmented and may depart
          //   from this in unexpected ways.  Also note that the associative array
          //   does not define an ordering and so may include the rfc ids after
          //   the comment which may then be truncated
          // TODO: Investigate how to retrieve request payload properties
          //   without creating a separate VO class for every composition of
          //   possible input parameters
        }, {
          params: {
            rfcIdList: rfcIds,
            comment: comment
          }
        });
      },
      getGlobalTable: function(requestObj) {
        return s.post('json/rfc/vehicle.rfc.offerMgr.json.smd.loadRfcTabPage', requestObj);
      }
    },
    RequestType: {
      // List<RfcChangeTypeVO> changeTypeList
      getRequestType: function(vehicleVersionId, offerId) {
        return s.post('/emm/rfc.requestChange.getUnlockedChangeTypes.json.action', {
          vehicle : {
            vehicleVersion: {
              id: vehicleVersionId
            }
          },
          offer: {
            id: offerId
          }
        });
      }
    },
    OfferType: {
      getOfferType: function() {
        return s.post('/emm/vehicle.offerMgr.getOfferTypes.action');
      }
    },
    OfferReview: {
      getOfferReviewTaskType: function() {
        return s.post('/emm/offer.review.getOfferReviewTaskTypeList.action');
      },
      getOfferReviewDetails: function(offerId) {
        return s.get('offer.review.getOfferReviewTaskDetailListByOffer.action', {
          "offer.id": offerId
        });
      },
      updateOfferReviewApprove: function(vehicleId, offerId, taskTypeId, taskId) {
        return s.get('offer.review.FIXME_APPROVE_ACTION_NAME.action', {
          "vehicle.id": vehicleId,
          "task.offerReview.offer.id": offerId,
          "task.taskType.id": taskTypeId,
          "task.id": taskId
        });
      },
      updateOfferReviewReject: function(vehicleId, offerId, taskTypeId, taskId) {
        return s.get('offer.review.FIXME_DECLINE_ACTION_NAME.action', {
          "vehicle.id": vehicleId,
          "task.offerReview.offer.id": offerId,
          "task.taskType.id": taskTypeId,
          "task.id": taskId
        });
      },
      updateOfferReviewRemind: function(vehicleId, offerId, taskTypeId, taskId) {
        return s.get('offer.review.sendRemindEmail.action', {
          "vehicle.id": vehicleId,
          "task.offerReview.offer.id": offerId,
          "task.taskType.id": taskTypeId,
          "task.id": taskId
        });
      },
      updateOfferReviewCancel: function(vehicleId, offerId) {
        return s.get('offer.review.cancelOfferReview.action', {
          "vehicle.id": vehicleId,
          "offerReview.offer.id": offerId
        });
      }
    },
    ItemCompare: {
      // OfferVO offerVo
      getRfcOffer: function(offerId, cppPromoVehicleVersionSpaceId) {
        if(cppPromoVehicleVersionSpaceId) {
          return s.post('/emm/rfc.requestChange.getRfcOffer.json.action', {
            offer: {
              id: offerId,
              cppPromoVehicleVersionSpace: { id: cppPromoVehicleVersionSpaceId }
            },
            vehicle: { id: vehicleModuleData.id }
          });
        } else {
          return s.post('/emm/rfc.requestChange.getRfcOffer.json.action', {
            offer: { id: offerId },
            vehicle: { id: vehicleModuleData.id }
          });
        }
      },
      getExistingRfc: function(rfcId) {
        return s.post('/emm/rfc.requestChange.getRfcDetails.json.action', {
          rfcDetail: { id: rfcId }
        });
      },
      getExistingAlignments: function(rfcId) {
        return s.post('/emm/rfc.requestChange.getExistingOfferAlignment.json.action', {
          rfcDetail: { id: rfcId }
        });
      },
      // OfferVersionSkuVO featuredSkuList
      getOfferVersionFeaturedSkus: function(offerVersionId) {
        return s.post('/emm/rfc.requestChange.getOfferVersionFeaturedSkuList.json.action', {
          offerVersion: { id: offerVersionId }
        });
      },
      // List<ChannelVO> channelList
      getOfferChannels: function(offerId) {
        return s.post('/emm/rfc.requestChange.getChannelListByOfferId.json.action', {
          offer: { id: offerId }
        });
      },
      getParkingLot: function(requestObj) {
        return s.post('/emm/rfc.requestChange.getParkingLotOfferList.json.action', requestObj);
      },
      // List<MerchandiseHierarchyVO> sbuList
      getSbuFilters: function() {
        return s.post('/emm/rfc.requestChange.getSBUList.json.action', {
        });
      },
      // List<MerchandiseHierarchyVO> catList
      getCategoryFilters: function(sbuId) {
        return s.post('/emm/rfc.requestChange.getCatList.json.action', {
          sbuMH: { id: sbuId }
        });
      },
      // List<OfferVO> offerList
      getAlignment: function(requestObj) {
        return s.post('/emm/rfc.requestChange.getOfferAlignment.json.action', requestObj);
      },
      // List<OfferVO> offerList
      getAlignmentForReview: function(requestObj) {
        return s.post('/emm/rfc.requestChange.getOfferAlignmentForReview.json.action', requestObj);
      }
    },
    CreateRfc: {
      createRfc: function(vehicleVersionId, rfcChangeTypeId, alignmentOffers, replaceOfferId, adBlockId, vehicleChannelId) {
        return s.post('rfc.requestChange.submitRfc.json.action', {
          vehicle: {
            vehicleVersion: {id: vehicleVersionId}
          },
          offer: { id: replaceOfferId },
          alignOfferList: angular.element.map(alignmentOffers, function(ele, i) {
            return {
              offer: {
                id: ele.id,
                adBlock: {
                  id: ele.adBlock.id,
                  layoutPage: {
                    layout: {
                      channelId: ele.adBlock.layoutPage ? ele.adBlock.layoutPage.layout.channelId : vehicleChannelId
                    }
                  }
                }
              },
              changeType: { id: rfcChangeTypeId }
            };
          })
        });
      },
      updateRfc: function(rfcId, rfcChangeTypeId, alignmentOffers, replaceOfferId, adBlockId, vehicleChannelId) {
        return s.post('rfc.requestChange.updateRfcDetails.json.action', {
          rfcDetail: {
            id: rfcId,
            offer: { id: replaceOfferId },
            changeType: { id: rfcChangeTypeId }
          },
          alignOfferList: angular.element.map(alignmentOffers, function(ele, i) {
            return {
              offer: {
                id: ele.id,
                adBlock: {
                  id: ele.adBlock.id,
                  layoutPage: {
                    layout: {
                      channelId: ele.adBlock.layoutPage.layout.channelId
                    }
                  }
                }
              },
              changeType: { id: rfcChangeTypeId }
            };
          })
        });
      },
      getExistingEmailApprovers: function(requestObj) {
        return s.post('/emm/rfc.requestChange.getExistingApproverList.json.action', {
          rfcDetail: { id: requestObj.rfcId }
        });
      },
      getEmailApprovers: function(requestObj) {
        return s.post('/emm/rfc.requestChange.getAllRfcApproversByKey.json.action', {
          rfcDetail: { id: requestObj.rfcId }
        }, {
          params: {
            searchKey: requestObj.search
          }
        });
      },
      setEmailApprovers: function(rfcId, userIds) {
        return s.post('/emm/rfc.requestChange.updateApproverList.json.action', {
          rfcDetail: { id: rfcId },
          approverList: angular.element.map(userIds, function(ele, i) {
            return { id: ele }
          })
        });
      }
    },
    Wizard: {
      getRfcOffer: function(offerId, vehicleId, rfcId) {
        var rfcDetailObj = rfcId ? { id: rfcId } : undefined;
        //return s.post('json/rfc/wz.offer.json', {
        return s.post('/emm/vehicle.rfc.offerMgr.json.smd.loadOffer.action', {
          vehicle : {
            id: vehicleId
          },
          offer : {
            id: offerId
          },
          rfcDetail: rfcDetailObj
        });
      },
      getOfferVersionAttributes: function(offerVersion, vehicleId) {
        return s.post('/emm/vehicle.rfc.offerMgr.json.smd.loadOfferVersionAttributes.action', {
          vehicle : {
            id: vehicleId
          },
          offer : {
            id: offerVersion.offer.id
          },
          offerVersion : {
            id: offerVersion.id
          }
        });
      },
      createCopyChange: function(offerId, alignmentOffers, modifiedItems, adBlockId, defaultChannelId) {
        return s.post('/emm/vehicle.rfc.offerMgr.json.smd.saveCopyChange.action', {
          offer : {
            id: offerId,
            offerVersionList: modifiedItems,
            adBlock: {
              id: adBlockId
            }
          },
          rfcAlignmentOfferList: angular.element.map(alignmentOffers, function(ele, i) {
            if(ele.adBlock && ele.adBlock.layoutPage) {
              return { id: ele.id, channel: { id: ele.adBlock.layoutPage.layout.channelId }, adBlock: {id: ele.adBlock.id}};
            } else {
              // FIXME - should never be using a default channel - it should always be defined
              // per alignment - the base alignment should have it's own channel defined in the context
              return { id: ele.id, channel: { id: defaultChannelId }, adBlock: {id: ele.adBlock.id}};
            }
          })
        });
      },
      createRfcFromWizard: function(changeTypeId, vehicleVersionId, offerId, alignmentOffers, modifiedItems, adBlockId, channelCode, channelId) {
        return s.post('/emm/vehicle.rfc.offerMgr.json.smd.saveRfcOffer.action', {
          offer : {
            id: offerId,
            offerVersionList: modifiedItems,
            adBlock: {
              id: adBlockId
            }
          },
          changeType : {
            id: changeTypeId
          },
          vehicle : {
            vehicleVersion: {
              id: vehicleVersionId
            },
            channel : {
              codeName: channelCode
            }
          },
          rfcAlignmentOfferList: angular.element.map(alignmentOffers, function(ele, i) {
            var alignAdBlockId = (ele.adBlock && ele.adBlock.id) ? ele.adBlock.id : adBlockId;
            if(ele.adBlock && ele.adBlock.layoutPage) {
              return { id: ele.id, channel: { id: ele.adBlock.layoutPage.layout.channelId }, adBlock: {id: alignAdBlockId}};
            } else {
              return { id: ele.id, channel: { id: channelId }, adBlock: {id: alignAdBlockId}};
            }
          })
        });
      },
      editRfcFromWizard: function(rfcId, offerId, modifiedItems, rfcChangeTypeId, alignmentOffers, defaultChannelId, defaultAdBlockId) {
        return s.post('rfc.requestChange.updateRfcDetails.json.action', {
          rfcDetail: {
            id: rfcId,
            changeType: { id: rfcChangeTypeId },
            offer: {
              id: offerId,
              offerVersionList: modifiedItems
            }
          },
          alignOfferList: angular.element.map(alignmentOffers, function(ele, i) {
            var adBlockId, channelId;
            if(ele.adBlock && ele.adBlock.layoutPage) {
              adBlockId = ele.adBlock.id;
              channelId = ele.adBlock.layoutPage.layout.channelId;
            } else {
              adBlockId = defaultAdBlockId;
              channelId = defaultChannelId;
            }
            return {
              id: ele.id,
              offer: {
                adBlock: {
                  id: adBlockId,
                  layoutPage: {
                    layout: {
                      channelId: channelId
                    }
                  }
                }
              },
              changeType: { id: rfcChangeTypeId }
            };
          })
        });
      },
      getRfcOfferAlignment: function(requestObj) {
        return s.post('/emm/rfc.requestChange.getOfferAlignment.json.action', requestObj);
      },
      getRfcOfferAlignmentForReview: function(requestObj) {
        return s.post('/emm/rfc.requestChange.getOfferAlignmentForReview.json.action', requestObj);
      },
      getChannelListByOffer: function(offerId) {
        return s.post('/emm/rfc.requestChange.getChannelListByOfferId.json.action', {offer: {id: offerId }});
      },
      getOfferSelectedItems: function(requestObj) {
        //return s.post('json/rfc/wz.items.json', {
        return s.post('/emm/vehicle.rfc.offerMgr.json.smd.loadOfferVersionSkus.action', requestObj /*{
          offerVersion: {
            id: offerVersionId
          },
          paging: {
            startPos: 1,
            pageSize: 10,
            direction: 'NEXT'
          }
        }*/);
      },
      getOfferFeaturedItems: function(offerVersionId) {
        //return s.post('json/rfc/wz.ftrItems.json', {
        return s.post('/emm/vehicle.rfc.offerMgr.json.smd.loadFeaturedItem.action', {
          offerVersion: {
            id: offerVersionId
          }
        });
      },
      getRfcOfferMkts: function(offerVersionId) {
        //return s.post('json/rfc/wz.offer.mkts.json', {
        return s.post('/emm/vehicle.rfc.offerMgr.json.smd.loadOfferVersionMarketList.action', {
          offerVersion: {
            id: offerVersionId,
          },
          paging: {
            currentStartPos: 1
          }
        });
      },
      getRfcOfferMktStores: function(vehicleMktId) {
        return s.post('/emm/vehicle.rfc.offerMgr.json.smd.loadMarketStores.action', {
          vehicleMarketId: vehicleMktId
        });
      },
      getRfcOfferProfitability: function(offer) {
        var cppPromoVehicleVersionSpace = null;
        if(offer.cppPromoVehicleVersionSpace) {
          cppPromoVehicleVersionSpace = { id: offer.cppPromoVehicleVersionSpace.id };
        }
        //return s.post('json/rfc/wz.offer.profitability.json', {offerId: offerId});
        return s.post('/emm/vehicle.rfc.offerMgr.json.smd.showProfitability.action', {
          offer : {
            id: offer.id,
            cppPromoVehicleVersionSpace: cppPromoVehicleVersionSpace
          }
        });
      },
      getRfcDetails: function(rfcId) {
        return s.post('/emm/rfc.requestChange.getRfcDetails.json.action', {
          rfcDetail: { id: rfcId }
        });
      },
      uploadImageChange: function($scope, formElement, itemNumber, modelUpdateCallback) {
        var deferred = $q.defer();
        $(formElement).ajaxSubmit({
          url: emmFn.getActionName("vehicle.offerMgr.uploadFeaturedItem"),
          type: "POST",
          dataType: "json",
          data: { itemNbr: itemNumber },
          success: function(response) {
            $scope.$apply(function() {
              if(response.success) {
                var imageId = response.data;
                var started = Date.now();
                var interval = setInterval(function() {
                  var now = Date.now();
                  if(now - started > 15000) {
                    clearInterval(interval);
                  } else {
                    emmFn.execute({
                      url : "vehicle.offerMgr.imageCheck",
                      data : "imageId=" + imageId,
                      target: $("#hiddenDivForAjaxTarget"),
                      async: false,
                      success : function(data1) {
                        if(!data1.data) return;
                        modelUpdateCallback(imageId);
                        clearInterval(interval);
                      }
                    });
                  }
                }, 3000);

                deferred.resolve(response);
              } else {
                deferred.reject(response);
              }
            });
          },
          error: function(response) {
            $scope.$apply(function() {
              deferred.reject(response);
            });
          }
        });
        return deferred.promise;
      },
      declineRfc: function(rfcId, comment) {
        return s.post('vehicle.rfc.declined.json.smd.action', {
          rfcDetail: {
            id: rfcId,
            commentList: [{comment: comment}]
          }
        });
      },
      approveRfc: function(rfcId, comment) {
        return s.post('vehicle.rfc.approved.json.smd.action', {
          rfcDetail: {
            id: rfcId,
            commentList: [{comment: comment}]
          }
        });
      },
      cancelRfc: function(rfcId) {
        return s.post('vehicle.rfc.cancelled.json.smd.action', {
          rfcDetail: {
            id: rfcId,
            commentList: [{comment: 'RFC cancelled'}]
          }
        });
      },
    }
  }
  return s;

}
API.$inject = ['$http', '$q', '$timeout'];
