var REGEXPS = { unlikelyCandidates: /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i, okMaybeItsACandidate: /and|article|body|column|content|main|shadow/i }; function isNodeVisible(e) { return (!e.style || "none" != e.style.display) && !e.hasAttribute("hidden") && (!e.hasAttribute("aria-hidden") || "true" != e.getAttribute("aria-hidden") || e.className && e.className.indexOf && -1 !== e.className.indexOf("fallback-image")) } function isProbablyReaderable(e, a) { a || (a = isNodeVisible); var r = e.querySelectorAll("p, pre"), t = e.querySelectorAll("div > br"); if (t.length) { var i = new Set(r);[].forEach.call(t, function (e) { i.add(e.parentNode) }), r = Array.from(i) } var n = 0; return [].some.call(r, function (e) { if (!a(e)) return !1; var r = e.className + " " + e.id; if (REGEXPS.unlikelyCandidates.test(r) && !REGEXPS.okMaybeItsACandidate.test(r)) return !1; if (e.matches("li p")) return !1; var t = e.textContent.trim().length; return !(t < 140) && (n += Math.sqrt(t - 140)) > 20 }) } "object" == typeof module && (module.exports = isProbablyReaderable);