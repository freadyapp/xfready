function Readability(e, t) { if (t && t.documentElement) e = t, t = arguments[2]; else if (!e || !e.documentElement) throw new Error("First argument to Readability constructor should be a document object."); var i; t = t || {}, this._doc = e, this._docJSDOMParser = this._doc.firstChild.__JSDOMParser__, this._articleTitle = null, this._articleByline = null, this._articleDir = null, this._articleSiteName = null, this._attempts = [], this._debug = !!t.debug, this._maxElemsToParse = t.maxElemsToParse || this.DEFAULT_MAX_ELEMS_TO_PARSE, this._nbTopCandidates = t.nbTopCandidates || this.DEFAULT_N_TOP_CANDIDATES, this._charThreshold = t.charThreshold || this.DEFAULT_CHAR_THRESHOLD, this._classesToPreserve = this.CLASSES_TO_PRESERVE.concat(t.classesToPreserve || []), this._keepClasses = !!t.keepClasses, this._serializer = t.serializer || function (e) { return e.innerHTML }, this._disableJSONLD = !!t.disableJSONLD, this._flags = this.FLAG_STRIP_UNLIKELYS | this.FLAG_WEIGHT_CLASSES | this.FLAG_CLEAN_CONDITIONALLY, this._debug ? (i = function (e) { var t = e.nodeName + " "; if (e.nodeType == e.TEXT_NODE) return t + '("' + e.textContent + '")'; var i = e.className && "." + e.className.replace(/ /g, "."), a = ""; return e.id ? a = "(#" + e.id + i + ")" : i && (a = "(" + i + ")"), t + a }, this.log = function () { if ("undefined" != typeof dump) { var e = Array.prototype.map.call(arguments, function (e) { return e && e.nodeName ? i(e) : e }).join(" "); dump("Reader: (Readability) " + e + "\n") } else if ("undefined" != typeof console) { var t = ["Reader: (Readability) "].concat(arguments); console.log.apply(console, t) } }) : this.log = function () { } } Readability.prototype = { FLAG_STRIP_UNLIKELYS: 1, FLAG_WEIGHT_CLASSES: 2, FLAG_CLEAN_CONDITIONALLY: 4, ELEMENT_NODE: 1, TEXT_NODE: 3, DEFAULT_MAX_ELEMS_TO_PARSE: 0, DEFAULT_N_TOP_CANDIDATES: 5, DEFAULT_TAGS_TO_SCORE: "section,h2,h3,h4,h5,h6,p,td,pre".toUpperCase().split(","), DEFAULT_CHAR_THRESHOLD: 500, REGEXPS: { unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i, okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i, positive: /article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i, negative: /hidden|^hid$| hid$| hid |^hid |banner|combx|comment|com-|contact|foot|footer|footnote|gdpr|masthead|media|meta|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|tool|widget/i, extraneous: /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single|utility/i, byline: /byline|author|dateline|writtenby|p-author/i, replaceFonts: /<(\/?)font[^>]*>/gi, normalize: /\s{2,}/g, videos: /\/\/(www\.)?((dailymotion|youtube|youtube-nocookie|player\.vimeo|v\.qq)\.com|(archive|upload\.wikimedia)\.org|player\.twitch\.tv)/i, shareElements: /(\b|_)(share|sharedaddy)(\b|_)/i, nextLink: /(next|weiter|continue|>([^\|]|$)|»([^\|]|$))/i, prevLink: /(prev|earl|old|new|<|«)/i, whitespace: /^\s*$/, hasContent: /\S$/, srcsetUrl: /(\S+)(\s+[\d.]+[xw])?(\s*(?:,|$))/g, b64DataUrl: /^data:\s*([^\s;,]+)\s*;\s*base64\s*,/i, jsonLdArticleTypes: /^Article|AdvertiserContentArticle|NewsArticle|AnalysisNewsArticle|AskPublicNewsArticle|BackgroundNewsArticle|OpinionNewsArticle|ReportageNewsArticle|ReviewNewsArticle|Report|SatiricalArticle|ScholarlyArticle|MedicalScholarlyArticle|SocialMediaPosting|BlogPosting|LiveBlogPosting|DiscussionForumPosting|TechArticle|APIReference$/ }, UNLIKELY_ROLES: ["menu", "menubar", "complementary", "navigation", "alert", "alertdialog", "dialog"], DIV_TO_P_ELEMS: ["A", "BLOCKQUOTE", "DL", "DIV", "IMG", "OL", "P", "PRE", "TABLE", "UL", "SELECT"], ALTER_TO_DIV_EXCEPTIONS: ["DIV", "ARTICLE", "SECTION", "P"], PRESENTATIONAL_ATTRIBUTES: ["align", "background", "bgcolor", "border", "cellpadding", "cellspacing", "frame", "hspace", "rules", "style", "valign", "vspace"], DEPRECATED_SIZE_ATTRIBUTE_ELEMS: ["TABLE", "TH", "TD", "HR", "PRE"], PHRASING_ELEMS: ["ABBR", "AUDIO", "B", "BDO", "BR", "BUTTON", "CITE", "CODE", "DATA", "DATALIST", "DFN", "EM", "EMBED", "I", "IMG", "INPUT", "KBD", "LABEL", "MARK", "MATH", "METER", "NOSCRIPT", "OBJECT", "OUTPUT", "PROGRESS", "Q", "RUBY", "SAMP", "SCRIPT", "SELECT", "SMALL", "SPAN", "STRONG", "SUB", "SUP", "TEXTAREA", "TIME", "VAR", "WBR"], CLASSES_TO_PRESERVE: ["page"], HTML_ESCAPE_MAP: { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" }, _postProcessContent: function (e) { this._fixRelativeUris(e), this._simplifyNestedElements(e), this._keepClasses || this._cleanClasses(e) }, _removeNodes: function (e, t) { if (this._docJSDOMParser && e._isLiveNodeList) throw new Error("Do not pass live node lists to _removeNodes"); for (var i = e.length - 1; i >= 0; i--) { var a = e[i], n = a.parentNode; n && (t && !t.call(this, a, i, e) || n.removeChild(a)) } }, _replaceNodeTags: function (e, t) { if (this._docJSDOMParser && e._isLiveNodeList) throw new Error("Do not pass live node lists to _replaceNodeTags"); for (var i = e.length - 1; i >= 0; i--) { var a = e[i]; this._setNodeTag(a, t) } }, _forEachNode: function (e, t) { Array.prototype.forEach.call(e, t, this) }, _findNode: function (e, t) { return Array.prototype.find.call(e, t, this) }, _someNode: function (e, t) { return Array.prototype.some.call(e, t, this) }, _everyNode: function (e, t) { return Array.prototype.every.call(e, t, this) }, _concatNodeLists: function () { var e = Array.prototype.slice, t = e.call(arguments).map(function (t) { return e.call(t) }); return Array.prototype.concat.apply([], t) }, _getAllNodesWithTag: function (e, t) { return e.querySelectorAll ? e.querySelectorAll(t.join(",")) : [].concat.apply([], t.map(function (t) { var i = e.getElementsByTagName(t); return Array.isArray(i) ? i : Array.from(i) })) }, _cleanClasses: function (e) { var t = this._classesToPreserve, i = (e.getAttribute("class") || "").split(/\s+/).filter(function (e) { return -1 != t.indexOf(e) }).join(" "); for (i ? e.setAttribute("class", i) : e.removeAttribute("class"), e = e.firstElementChild; e; e = e.nextElementSibling)this._cleanClasses(e) }, _fixRelativeUris: function (e) { var t = this._doc.baseURI, i = this._doc.documentURI; function a(e) { if (t == i && "#" == e.charAt(0)) return e; try { return new URL(e, t).href } catch (e) { } return e } var n = this._getAllNodesWithTag(e, ["a"]); this._forEachNode(n, function (e) { var t = e.getAttribute("href"); if (t) if (0 === t.indexOf("javascript:")) if (1 === e.childNodes.length && e.childNodes[0].nodeType === this.TEXT_NODE) { var i = this._doc.createTextNode(e.textContent); e.parentNode.replaceChild(i, e) } else { for (var n = this._doc.createElement("span"); e.childNodes.length > 0;)n.appendChild(e.childNodes[0]); e.parentNode.replaceChild(n, e) } else e.setAttribute("href", a(t)) }); var r = this._getAllNodesWithTag(e, ["img", "picture", "figure", "video", "audio", "source"]); this._forEachNode(r, function (e) { var t = e.getAttribute("src"), i = e.getAttribute("poster"), n = e.getAttribute("srcset"); if (t && e.setAttribute("src", a(t)), i && e.setAttribute("poster", a(i)), n) { var r = n.replace(this.REGEXPS.srcsetUrl, function (e, t, i, n) { return a(t) + (i || "") + n }); e.setAttribute("srcset", r) } }) }, _simplifyNestedElements: function (e) { for (var t = e; t;) { if (t.parentNode && ["DIV", "SECTION"].includes(t.tagName) && (!t.id || !t.id.startsWith("readability"))) { if (this._isElementWithoutContent(t)) { t = this._removeAndGetNext(t); continue } if (this._hasSingleTagInsideElement(t, "DIV") || this._hasSingleTagInsideElement(t, "SECTION")) { for (var i = t.children[0], a = 0; a < t.attributes.length; a++)i.setAttribute(t.attributes[a].name, t.attributes[a].value); t.parentNode.replaceChild(i, t), t = i; continue } } t = this._getNextNode(t) } }, _getArticleTitle: function () { var e = this._doc, t = "", i = ""; try { "string" != typeof (t = i = e.title.trim()) && (t = i = this._getInnerText(e.getElementsByTagName("title")[0])) } catch (e) { } var a = !1; function n(e) { return e.split(/\s+/).length } if (/ [\|\-\\\/>»] /.test(t)) a = / [\\\/>»] /.test(t), n(t = i.replace(/(.*)[\|\-\\\/>»] .*/gi, "$1")) < 3 && (t = i.replace(/[^\|\-\\\/>»]*[\|\-\\\/>»](.*)/gi, "$1")); else if (-1 !== t.indexOf(": ")) { var r = this._concatNodeLists(e.getElementsByTagName("h1"), e.getElementsByTagName("h2")), s = t.trim(); this._someNode(r, function (e) { return e.textContent.trim() === s }) || (n(t = i.substring(i.lastIndexOf(":") + 1)) < 3 ? t = i.substring(i.indexOf(":") + 1) : n(i.substr(0, i.indexOf(":"))) > 5 && (t = i)) } else if (t.length > 150 || t.length < 15) { var l = e.getElementsByTagName("h1"); 1 === l.length && (t = this._getInnerText(l[0])) } var o = n(t = t.trim().replace(this.REGEXPS.normalize, " ")); return o <= 4 && (!a || o != n(i.replace(/[\|\-\\\/>»]+/g, "")) - 1) && (t = i), t }, _prepDocument: function () { var e = this._doc; this._removeNodes(this._getAllNodesWithTag(e, ["style"])), e.body && this._replaceBrs(e.body), this._replaceNodeTags(this._getAllNodesWithTag(e, ["font"]), "SPAN") }, _nextElement: function (e) { for (var t = e; t && t.nodeType != this.ELEMENT_NODE && this.REGEXPS.whitespace.test(t.textContent);)t = t.nextSibling; return t }, _replaceBrs: function (e) { this._forEachNode(this._getAllNodesWithTag(e, ["br"]), function (e) { for (var t = e.nextSibling, i = !1; (t = this._nextElement(t)) && "BR" == t.tagName;) { i = !0; var a = t.nextSibling; t.parentNode.removeChild(t), t = a } if (i) { var n = this._doc.createElement("p"); for (e.parentNode.replaceChild(n, e), t = n.nextSibling; t;) { if ("BR" == t.tagName) { var r = this._nextElement(t.nextSibling); if (r && "BR" == r.tagName) break } if (!this._isPhrasingContent(t)) break; var s = t.nextSibling; n.appendChild(t), t = s } for (; n.lastChild && this._isWhitespace(n.lastChild);)n.removeChild(n.lastChild); "P" === n.parentNode.tagName && this._setNodeTag(n.parentNode, "DIV") } }) }, _setNodeTag: function (e, t) { if (this.log("_setNodeTag", e, t), this._docJSDOMParser) return e.localName = t.toLowerCase(), e.tagName = t.toUpperCase(), e; for (var i = e.ownerDocument.createElement(t); e.firstChild;)i.appendChild(e.firstChild); e.parentNode.replaceChild(i, e), e.readability && (i.readability = e.readability); for (var a = 0; a < e.attributes.length; a++)try { i.setAttribute(e.attributes[a].name, e.attributes[a].value) } catch (e) { } return i }, _prepArticle: function (e) { this._cleanStyles(e), this._markDataTables(e), this._fixLazyImages(e), this._cleanConditionally(e, "form"), this._cleanConditionally(e, "fieldset"), this._clean(e, "object"), this._clean(e, "embed"), this._clean(e, "h1"), this._clean(e, "footer"), this._clean(e, "link"), this._clean(e, "aside"); var t = this.DEFAULT_CHAR_THRESHOLD; this._forEachNode(e.children, function (e) { this._cleanMatchedNodes(e, function (e, i) { return this.REGEXPS.shareElements.test(i) && e.textContent.length < t }) }); var i = e.getElementsByTagName("h2"); if (1 === i.length) { var a = (i[0].textContent.length - this._articleTitle.length) / this._articleTitle.length; if (Math.abs(a) < .5) { (a > 0 ? i[0].textContent.includes(this._articleTitle) : this._articleTitle.includes(i[0].textContent)) && this._clean(e, "h2") } } this._clean(e, "iframe"), this._clean(e, "input"), this._clean(e, "textarea"), this._clean(e, "select"), this._clean(e, "button"), this._cleanHeaders(e), this._cleanConditionally(e, "table"), this._cleanConditionally(e, "ul"), this._cleanConditionally(e, "div"), this._removeNodes(this._getAllNodesWithTag(e, ["p"]), function (e) { return 0 === e.getElementsByTagName("img").length + e.getElementsByTagName("embed").length + e.getElementsByTagName("object").length + e.getElementsByTagName("iframe").length && !this._getInnerText(e, !1) }), this._forEachNode(this._getAllNodesWithTag(e, ["br"]), function (e) { var t = this._nextElement(e.nextSibling); t && "P" == t.tagName && e.parentNode.removeChild(e) }), this._forEachNode(this._getAllNodesWithTag(e, ["table"]), function (e) { var t = this._hasSingleTagInsideElement(e, "TBODY") ? e.firstElementChild : e; if (this._hasSingleTagInsideElement(t, "TR")) { var i = t.firstElementChild; if (this._hasSingleTagInsideElement(i, "TD")) { var a = i.firstElementChild; a = this._setNodeTag(a, this._everyNode(a.childNodes, this._isPhrasingContent) ? "P" : "DIV"), e.parentNode.replaceChild(a, e) } } }) }, _initializeNode: function (e) { switch (e.readability = { contentScore: 0 }, e.tagName) { case "DIV": e.readability.contentScore += 5; break; case "PRE": case "TD": case "BLOCKQUOTE": e.readability.contentScore += 3; break; case "ADDRESS": case "OL": case "UL": case "DL": case "DD": case "DT": case "LI": case "FORM": e.readability.contentScore -= 3; break; case "H1": case "H2": case "H3": case "H4": case "H5": case "H6": case "TH": e.readability.contentScore -= 5 }e.readability.contentScore += this._getClassWeight(e) }, _removeAndGetNext: function (e) { var t = this._getNextNode(e, !0); return e.parentNode.removeChild(e), t }, _getNextNode: function (e, t) { if (!t && e.firstElementChild) return e.firstElementChild; if (e.nextElementSibling) return e.nextElementSibling; do { e = e.parentNode } while (e && !e.nextElementSibling); return e && e.nextElementSibling }, _checkByline: function (e, t) { if (this._articleByline) return !1; if (void 0 !== e.getAttribute) var i = e.getAttribute("rel"), a = e.getAttribute("itemprop"); return !(!("author" === i || a && -1 !== a.indexOf("author") || this.REGEXPS.byline.test(t)) || !this._isValidByline(e.textContent)) && (this._articleByline = e.textContent.trim(), !0) }, _getNodeAncestors: function (e, t) { t = t || 0; for (var i = 0, a = []; e.parentNode && (a.push(e.parentNode), !t || ++i !== t);)e = e.parentNode; return a }, _grabArticle: function (e) { this.log("**** grabArticle ****"); var t = this._doc, i = null !== e; if (!(e = e || this._doc.body)) return this.log("No body found in document. Abort."), null; for (var a = e.innerHTML; ;) { for (var n = this._flagIsActive(this.FLAG_STRIP_UNLIKELYS), r = [], s = this._doc.documentElement; s;) { var l = s.className + " " + s.id; if (this._isProbablyVisible(s)) if (this._checkByline(s, l)) s = this._removeAndGetNext(s); else { if (n) { if (this.REGEXPS.unlikelyCandidates.test(l) && !this.REGEXPS.okMaybeItsACandidate.test(l) && !this._hasAncestorTag(s, "table") && "BODY" !== s.tagName && "A" !== s.tagName) { this.log("Removing unlikely candidate - " + l), s = this._removeAndGetNext(s); continue } if (this.UNLIKELY_ROLES.includes(s.getAttribute("role"))) { this.log("Removing content with role " + s.getAttribute("role") + " - " + l), s = this._removeAndGetNext(s); continue } } if ("DIV" !== s.tagName && "SECTION" !== s.tagName && "HEADER" !== s.tagName && "H1" !== s.tagName && "H2" !== s.tagName && "H3" !== s.tagName && "H4" !== s.tagName && "H5" !== s.tagName && "H6" !== s.tagName || !this._isElementWithoutContent(s)) { if (-1 !== this.DEFAULT_TAGS_TO_SCORE.indexOf(s.tagName) && r.push(s), "DIV" === s.tagName) { for (var o = null, h = s.firstChild; h;) { var c = h.nextSibling; if (this._isPhrasingContent(h)) null !== o ? o.appendChild(h) : this._isWhitespace(h) || (o = t.createElement("p"), s.replaceChild(o, h), o.appendChild(h)); else if (null !== o) { for (; o.lastChild && this._isWhitespace(o.lastChild);)o.removeChild(o.lastChild); o = null } h = c } if (this._hasSingleTagInsideElement(s, "P") && this._getLinkDensity(s) < .25) { var d = s.children[0]; s.parentNode.replaceChild(d, s), s = d, r.push(s) } else this._hasChildBlockElement(s) || (s = this._setNodeTag(s, "P"), r.push(s)) } s = this._getNextNode(s) } else s = this._removeAndGetNext(s) } else this.log("Removing hidden node - " + l), s = this._removeAndGetNext(s) } var g = []; this._forEachNode(r, function (e) { if (e.parentNode && void 0 !== e.parentNode.tagName) { var t = this._getInnerText(e); if (!(t.length < 25)) { var i = this._getNodeAncestors(e, 5); if (0 !== i.length) { var a = 0; a += 1, a += t.split(",").length, a += Math.min(Math.floor(t.length / 100), 3), this._forEachNode(i, function (e, t) { if (e.tagName && e.parentNode && void 0 !== e.parentNode.tagName) { if (void 0 === e.readability && (this._initializeNode(e), g.push(e)), 0 === t) var i = 1; else i = 1 === t ? 2 : 3 * t; e.readability.contentScore += a / i } }) } } } }); for (var u = [], m = 0, _ = g.length; m < _; m += 1) { var f = g[m], p = f.readability.contentScore * (1 - this._getLinkDensity(f)); f.readability.contentScore = p, this.log("Candidate:", f, "with score " + p); for (var N = 0; N < this._nbTopCandidates; N++) { var E = u[N]; if (!E || p > E.readability.contentScore) { u.splice(N, 0, f), u.length > this._nbTopCandidates && u.pop(); break } } } var b, T = u[0] || null, v = !1; if (null === T || "BODY" === T.tagName) { T = t.createElement("DIV"), v = !0; for (var A = e.childNodes; A.length;)this.log("Moving child out:", A[0]), T.appendChild(A[0]); e.appendChild(T), this._initializeNode(T) } else if (T) { for (var y = [], S = 1; S < u.length; S++)u[S].readability.contentScore / T.readability.contentScore >= .75 && y.push(this._getNodeAncestors(u[S])); if (y.length >= 3) for (b = T.parentNode; "BODY" !== b.tagName;) { for (var C = 0, L = 0; L < y.length && C < 3; L++)C += Number(y[L].includes(b)); if (C >= 3) { T = b; break } b = b.parentNode } T.readability || this._initializeNode(T), b = T.parentNode; for (var I = T.readability.contentScore, x = I / 3; "BODY" !== b.tagName;)if (b.readability) { var D = b.readability.contentScore; if (D < x) break; if (D > I) { T = b; break } I = b.readability.contentScore, b = b.parentNode } else b = b.parentNode; for (b = T.parentNode; "BODY" != b.tagName && 1 == b.children.length;)b = (T = b).parentNode; T.readability || this._initializeNode(T) } var R = t.createElement("DIV"); i && (R.id = "readability-content"); for (var O = Math.max(10, .2 * T.readability.contentScore), P = (b = T.parentNode).children, B = 0, w = P.length; B < w; B++) { var G = P[B], M = !1; if (this.log("Looking at sibling node:", G, G.readability ? "with score " + G.readability.contentScore : ""), this.log("Sibling has score", G.readability ? G.readability.contentScore : "Unknown"), G === T) M = !0; else { var H = 0; if (G.className === T.className && "" !== T.className && (H += .2 * T.readability.contentScore), G.readability && G.readability.contentScore + H >= O) M = !0; else if ("P" === G.nodeName) { var U = this._getLinkDensity(G), k = this._getInnerText(G), W = k.length; W > 80 && U < .25 ? M = !0 : W < 80 && W > 0 && 0 === U && -1 !== k.search(/\.( |$)/) && (M = !0) } } M && (this.log("Appending node:", G), -1 === this.ALTER_TO_DIV_EXCEPTIONS.indexOf(G.nodeName) && (this.log("Altering sibling:", G, "to div."), G = this._setNodeTag(G, "DIV")), R.appendChild(G), B -= 1, w -= 1) } if (this._debug && this.log("Article content pre-prep: " + R.innerHTML), this._prepArticle(R), this._debug && this.log("Article content post-prep: " + R.innerHTML), v) T.id = "readability-page-1", T.className = "page"; else { var F = t.createElement("DIV"); F.id = "readability-page-1", F.className = "page"; for (var X = R.childNodes; X.length;)F.appendChild(X[0]); R.appendChild(F) } this._debug && this.log("Article content after paging: " + R.innerHTML); var j = !0, V = this._getInnerText(R, !0).length; if (V < this._charThreshold) if (j = !1, e.innerHTML = a, this._flagIsActive(this.FLAG_STRIP_UNLIKELYS)) this._removeFlag(this.FLAG_STRIP_UNLIKELYS), this._attempts.push({ articleContent: R, textLength: V }); else if (this._flagIsActive(this.FLAG_WEIGHT_CLASSES)) this._removeFlag(this.FLAG_WEIGHT_CLASSES), this._attempts.push({ articleContent: R, textLength: V }); else if (this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY)) this._removeFlag(this.FLAG_CLEAN_CONDITIONALLY), this._attempts.push({ articleContent: R, textLength: V }); else { if (this._attempts.push({ articleContent: R, textLength: V }), this._attempts.sort(function (e, t) { return t.textLength - e.textLength }), !this._attempts[0].textLength) return null; R = this._attempts[0].articleContent, j = !0 } if (j) { var Y = [b, T].concat(this._getNodeAncestors(b)); return this._someNode(Y, function (e) { if (!e.tagName) return !1; var t = e.getAttribute("dir"); return !!t && (this._articleDir = t, !0) }), R } } }, _isValidByline: function (e) { return ("string" == typeof e || e instanceof String) && ((e = e.trim()).length > 0 && e.length < 100) }, _unescapeHtmlEntities: function (e) { if (!e) return e; var t = this.HTML_ESCAPE_MAP; return e.replace(/&(quot|amp|apos|lt|gt);/g, function (e, i) { return t[i] }).replace(/&#(?:x([0-9a-z]{1,4})|([0-9]{1,4}));/gi, function (e, t, i) { var a = parseInt(t || i, t ? 16 : 10); return String.fromCharCode(a) }) }, _getJSONLD: function (e) { var t = this._getAllNodesWithTag(e, ["script"]), i = this._findNode(t, function (e) { return "application/ld+json" === e.getAttribute("type") }); if (i) try { var a = i.textContent.replace(/^\s*<!\[CDATA\[|\]\]>\s*$/g, ""), n = JSON.parse(a), r = {}; return n["@context"] && n["@context"].match(/^https?\:\/\/schema\.org$/) ? (!n["@type"] && Array.isArray(n["@graph"]) && (n = n["@graph"].find(function (e) { return (e["@type"] || "").match(this.REGEXPS.jsonLdArticleTypes) })), n && n["@type"] && n["@type"].match(this.REGEXPS.jsonLdArticleTypes) ? ("string" == typeof n.name ? r.title = n.name.trim() : "string" == typeof n.headline && (r.title = n.headline.trim()), n.author && ("string" == typeof n.author.name ? r.byline = n.author.name.trim() : Array.isArray(n.author) && n.author[0] && "string" == typeof n.author[0].name && (r.byline = n.author.filter(function (e) { return e && "string" == typeof e.name }).map(function (e) { return e.name.trim() }).join(", "))), "string" == typeof n.description && (r.excerpt = n.description.trim()), n.publisher && "string" == typeof n.publisher.name && (r.siteName = n.publisher.name.trim()), r) : r) : r } catch (e) { this.log(e.message) } return {} }, _getArticleMetadata: function (e) { var t = {}, i = {}, a = this._doc.getElementsByTagName("meta"), n = /\s*(dc|dcterm|og|twitter)\s*:\s*(author|creator|description|title|site_name)\s*/gi, r = /^\s*(?:(dc|dcterm|og|twitter|weibo:(article|webpage))\s*[\.:]\s*)?(author|creator|description|title|site_name)\s*$/i; return this._forEachNode(a, function (e) { var t = e.getAttribute("name"), a = e.getAttribute("property"), s = e.getAttribute("content"); if (s) { var l = null, o = null; if (a && (l = a.match(n))) for (var h = l.length - 1; h >= 0; h--)o = l[h].toLowerCase().replace(/\s/g, ""), i[o] = s.trim(); !l && t && r.test(t) && (o = t, s && (o = o.toLowerCase().replace(/\s/g, "").replace(/\./g, ":"), i[o] = s.trim())) } }), t.title = e.title || i["dc:title"] || i["dcterm:title"] || i["og:title"] || i["weibo:article:title"] || i["weibo:webpage:title"] || i.title || i["twitter:title"], t.title || (t.title = this._getArticleTitle()), t.byline = e.byline || i["dc:creator"] || i["dcterm:creator"] || i.author, t.excerpt = e.excerpt || i["dc:description"] || i["dcterm:description"] || i["og:description"] || i["weibo:article:description"] || i["weibo:webpage:description"] || i.description || i["twitter:description"], t.siteName = e.siteName || i["og:site_name"], t.title = this._unescapeHtmlEntities(t.title), t.byline = this._unescapeHtmlEntities(t.byline), t.excerpt = this._unescapeHtmlEntities(t.excerpt), t.siteName = this._unescapeHtmlEntities(t.siteName), t }, _isSingleImage: function (e) { return "IMG" === e.tagName || 1 === e.children.length && "" === e.textContent.trim() && this._isSingleImage(e.children[0]) }, _unwrapNoscriptImages: function (e) { var t = Array.from(e.getElementsByTagName("img")); this._forEachNode(t, function (e) { for (var t = 0; t < e.attributes.length; t++) { var i = e.attributes[t]; switch (i.name) { case "src": case "srcset": case "data-src": case "data-srcset": return }if (/\.(jpg|jpeg|png|webp)/i.test(i.value)) return } e.parentNode.removeChild(e) }); var i = Array.from(e.getElementsByTagName("noscript")); this._forEachNode(i, function (t) { var i = e.createElement("div"); if (i.innerHTML = t.innerHTML, this._isSingleImage(i)) { var a = t.previousElementSibling; if (a && this._isSingleImage(a)) { var n = a; "IMG" !== n.tagName && (n = a.getElementsByTagName("img")[0]); for (var r = i.getElementsByTagName("img")[0], s = 0; s < n.attributes.length; s++) { var l = n.attributes[s]; if ("" !== l.value && ("src" === l.name || "srcset" === l.name || /\.(jpg|jpeg|png|webp)/i.test(l.value))) { if (r.getAttribute(l.name) === l.value) continue; var o = l.name; r.hasAttribute(o) && (o = "data-old-" + o), r.setAttribute(o, l.value) } } t.parentNode.replaceChild(i.firstElementChild, a) } } }) }, _removeScripts: function (e) { this._removeNodes(this._getAllNodesWithTag(e, ["script"]), function (e) { return e.nodeValue = "", e.removeAttribute("src"), !0 }), this._removeNodes(this._getAllNodesWithTag(e, ["noscript"])) }, _hasSingleTagInsideElement: function (e, t) { return 1 == e.children.length && e.children[0].tagName === t && !this._someNode(e.childNodes, function (e) { return e.nodeType === this.TEXT_NODE && this.REGEXPS.hasContent.test(e.textContent) }) }, _isElementWithoutContent: function (e) { return e.nodeType === this.ELEMENT_NODE && 0 == e.textContent.trim().length && (0 == e.children.length || e.children.length == e.getElementsByTagName("br").length + e.getElementsByTagName("hr").length) }, _hasChildBlockElement: function (e) { return this._someNode(e.childNodes, function (e) { return -1 !== this.DIV_TO_P_ELEMS.indexOf(e.tagName) || this._hasChildBlockElement(e) }) }, _isPhrasingContent: function (e) { return e.nodeType === this.TEXT_NODE || -1 !== this.PHRASING_ELEMS.indexOf(e.tagName) || ("A" === e.tagName || "DEL" === e.tagName || "INS" === e.tagName) && this._everyNode(e.childNodes, this._isPhrasingContent) }, _isWhitespace: function (e) { return e.nodeType === this.TEXT_NODE && 0 === e.textContent.trim().length || e.nodeType === this.ELEMENT_NODE && "BR" === e.tagName }, _getInnerText: function (e, t) { t = void 0 === t || t; var i = e.textContent.trim(); return t ? i.replace(this.REGEXPS.normalize, " ") : i }, _getCharCount: function (e, t) { return t = t || ",", this._getInnerText(e).split(t).length - 1 }, _cleanStyles: function (e) { if (e && "svg" !== e.tagName.toLowerCase()) { for (var t = 0; t < this.PRESENTATIONAL_ATTRIBUTES.length; t++)e.removeAttribute(this.PRESENTATIONAL_ATTRIBUTES[t]); -1 !== this.DEPRECATED_SIZE_ATTRIBUTE_ELEMS.indexOf(e.tagName) && (e.removeAttribute("width"), e.removeAttribute("height")); for (var i = e.firstElementChild; null !== i;)this._cleanStyles(i), i = i.nextElementSibling } }, _getLinkDensity: function (e) { var t = this._getInnerText(e).length; if (0 === t) return 0; var i = 0; return this._forEachNode(e.getElementsByTagName("a"), function (e) { i += this._getInnerText(e).length }), i / t }, _getClassWeight: function (e) { if (!this._flagIsActive(this.FLAG_WEIGHT_CLASSES)) return 0; var t = 0; return "string" == typeof e.className && "" !== e.className && (this.REGEXPS.negative.test(e.className) && (t -= 25), this.REGEXPS.positive.test(e.className) && (t += 25)), "string" == typeof e.id && "" !== e.id && (this.REGEXPS.negative.test(e.id) && (t -= 25), this.REGEXPS.positive.test(e.id) && (t += 25)), t }, _clean: function (e, t) { var i = -1 !== ["object", "embed", "iframe"].indexOf(t); this._removeNodes(this._getAllNodesWithTag(e, [t]), function (e) { if (i) { for (var t = 0; t < e.attributes.length; t++)if (this.REGEXPS.videos.test(e.attributes[t].value)) return !1; if ("object" === e.tagName && this.REGEXPS.videos.test(e.innerHTML)) return !1 } return !0 }) }, _hasAncestorTag: function (e, t, i, a) { i = i || 3, t = t.toUpperCase(); for (var n = 0; e.parentNode;) { if (i > 0 && n > i) return !1; if (e.parentNode.tagName === t && (!a || a(e.parentNode))) return !0; e = e.parentNode, n++ } return !1 }, _getRowAndColumnCount: function (e) { for (var t = 0, i = 0, a = e.getElementsByTagName("tr"), n = 0; n < a.length; n++) { var r = a[n].getAttribute("rowspan") || 0; r && (r = parseInt(r, 10)), t += r || 1; for (var s = 0, l = a[n].getElementsByTagName("td"), o = 0; o < l.length; o++) { var h = l[o].getAttribute("colspan") || 0; h && (h = parseInt(h, 10)), s += h || 1 } i = Math.max(i, s) } return { rows: t, columns: i } }, _markDataTables: function (e) { for (var t = e.getElementsByTagName("table"), i = 0; i < t.length; i++) { var a = t[i]; if ("presentation" != a.getAttribute("role")) if ("0" != a.getAttribute("datatable")) if (a.getAttribute("summary")) a._readabilityDataTable = !0; else { var n = a.getElementsByTagName("caption")[0]; if (n && n.childNodes.length > 0) a._readabilityDataTable = !0; else { if (["col", "colgroup", "tfoot", "thead", "th"].some(function (e) { return !!a.getElementsByTagName(e)[0] })) this.log("Data table because found data-y descendant"), a._readabilityDataTable = !0; else if (a.getElementsByTagName("table")[0]) a._readabilityDataTable = !1; else { var r = this._getRowAndColumnCount(a); r.rows >= 10 || r.columns > 4 ? a._readabilityDataTable = !0 : a._readabilityDataTable = r.rows * r.columns > 10 } } } else a._readabilityDataTable = !1; else a._readabilityDataTable = !1 } }, _fixLazyImages: function (e) { this._forEachNode(this._getAllNodesWithTag(e, ["img", "picture", "figure"]), function (e) { if (e.src && this.REGEXPS.b64DataUrl.test(e.src)) { if ("image/svg+xml" === this.REGEXPS.b64DataUrl.exec(e.src)[1]) return; for (var t = !1, i = 0; i < e.attributes.length; i++) { var a = e.attributes[i]; if ("src" !== a.name && /\.(jpg|jpeg|png|webp)/i.test(a.value)) { t = !0; break } } if (t) { var n = e.src.search(/base64\s*/i) + 7; e.src.length - n < 133 && e.removeAttribute("src") } } if (!(e.src || e.srcset && "null" != e.srcset) || -1 !== e.className.toLowerCase().indexOf("lazy")) for (var r = 0; r < e.attributes.length; r++)if ("src" !== (a = e.attributes[r]).name && "srcset" !== a.name) { var s = null; if (/\.(jpg|jpeg|png|webp)\s+\d/.test(a.value) ? s = "srcset" : /^\s*\S+\.(jpg|jpeg|png|webp)\S*\s*$/.test(a.value) && (s = "src"), s) if ("IMG" === e.tagName || "PICTURE" === e.tagName) e.setAttribute(s, a.value); else if ("FIGURE" === e.tagName && !this._getAllNodesWithTag(e, ["img", "picture"]).length) { var l = this._doc.createElement("img"); l.setAttribute(s, a.value), e.appendChild(l) } } }) }, _cleanConditionally: function (e, t) { if (this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY)) { var i = "ul" === t || "ol" === t; this._removeNodes(this._getAllNodesWithTag(e, [t]), function (e) { var a = function (e) { return e._readabilityDataTable }; if ("table" === t && a(e)) return !1; if (this._hasAncestorTag(e, "table", -1, a)) return !1; var n = this._getClassWeight(e); if (this.log("Cleaning Conditionally", e), n + 0 < 0) return !0; if (this._getCharCount(e, ",") < 10) { for (var r = e.getElementsByTagName("p").length, s = e.getElementsByTagName("img").length, l = e.getElementsByTagName("li").length - 100, o = e.getElementsByTagName("input").length, h = 0, c = this._getAllNodesWithTag(e, ["object", "embed", "iframe"]), d = 0; d < c.length; d++) { for (var g = 0; g < c[d].attributes.length; g++)if (this.REGEXPS.videos.test(c[d].attributes[g].value)) return !1; if ("object" === c[d].tagName && this.REGEXPS.videos.test(c[d].innerHTML)) return !1; h++ } var u = this._getLinkDensity(e), m = this._getInnerText(e).length; return s > 1 && r / s < .5 && !this._hasAncestorTag(e, "figure") || !i && l > r || o > Math.floor(r / 3) || !i && m < 25 && (0 === s || s > 2) && !this._hasAncestorTag(e, "figure") || !i && n < 25 && u > .2 || n >= 25 && u > .5 || 1 === h && m < 75 || h > 1 } return !1 }) } }, _cleanMatchedNodes: function (e, t) { for (var i = this._getNextNode(e, !0), a = this._getNextNode(e); a && a != i;)a = t.call(this, a, a.className + " " + a.id) ? this._removeAndGetNext(a) : this._getNextNode(a) }, _cleanHeaders: function (e) { this._removeNodes(this._getAllNodesWithTag(e, ["h1", "h2"]), function (e) { return this._getClassWeight(e) < 0 }) }, _flagIsActive: function (e) { return (this._flags & e) > 0 }, _removeFlag: function (e) { this._flags = this._flags & ~e }, _isProbablyVisible: function (e) { return (!e.style || "none" != e.style.display) && !e.hasAttribute("hidden") && (!e.hasAttribute("aria-hidden") || "true" != e.getAttribute("aria-hidden") || e.className && e.className.indexOf && -1 !== e.className.indexOf("fallback-image")) }, parse: function () { if (this._maxElemsToParse > 0) { var e = this._doc.getElementsByTagName("*").length; if (e > this._maxElemsToParse) throw new Error("Aborting parsing document; " + e + " elements found") } this._unwrapNoscriptImages(this._doc); var t = this._disableJSONLD ? {} : this._getJSONLD(this._doc); this._removeScripts(this._doc), this._prepDocument(); var i = this._getArticleMetadata(t); this._articleTitle = i.title; var a = this._grabArticle(); if (!a) return null; if (this.log("Grabbed: " + a.innerHTML), this._postProcessContent(a), !i.excerpt) { var n = a.getElementsByTagName("p"); n.length > 0 && (i.excerpt = n[0].textContent.trim()) } var r = a.textContent; return { title: this._articleTitle, byline: i.byline || this._articleByline, dir: this._articleDir, content: this._serializer(a), textContent: r, length: r.length, excerpt: i.excerpt, siteName: i.siteName || this._articleSiteName } } }, "object" == typeof module && (module.exports = Readability);