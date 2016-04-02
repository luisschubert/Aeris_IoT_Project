package main

import (
	"net/http"
)

func init() {
	http.Handle("/", http.FileServer(http.Dir(".")))
	http.ListenAndServe(":3000", nil)

}
