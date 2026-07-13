package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type IElement interface {
	IsIElement()
}

type ElementCore[P any, T any] struct {
	Type  string     `json:"type"`
	Props P          `json:"props,omitempty"`
	Nodes []IElement `json:"children,omitempty"`
	self  T
}

func (c *ElementCore[P, T]) IsIElement() {}

func (c *ElementCore[P, T]) Children(items ...IElement) T {
	if c.Nodes == nil {
		c.Nodes = make([]IElement, 0, len(items))
	}
	c.Nodes = append(c.Nodes, items...)
	return c.self
}

// ==========================================
// Generic element
// ==========================================
type Element struct {
	*ElementCore[map[string]any, *Element]
}

func NewElement(componentType string) *Element {
	element := &Element{}
	element.ElementCore = &ElementCore[map[string]any, *Element]{
		Type: componentType,
		self: element,
	}
	return element
}

// ==========================================
// Heading
// ==========================================
type HeadingProps struct {
	Level int `json:"level"`
}

type HeadingElement struct {
	*ElementCore[HeadingProps, *HeadingElement]
}

func Heading() *HeadingElement {
	element := &HeadingElement{}
	element.ElementCore = &ElementCore[HeadingProps, *HeadingElement]{
		Type:  "Heading",
		Props: HeadingProps{Level: 1},
		self:  element,
	}
	return element
}

func (h *HeadingElement) Level(lvl int) *HeadingElement {
	h.Props.Level = lvl
	return h
}

// ==========================================
// Button
// ==========================================
type ButtonProps struct {
	Action       string `json:"action,omitempty"`
	ActionTarget string `json:"actionTarget,omitempty"`
}

type ButtonElement struct {
	*ElementCore[ButtonProps, *ButtonElement]
}

func Button() *ButtonElement {
	element := &ButtonElement{}
	element.ElementCore = &ElementCore[ButtonProps, *ButtonElement]{
		Type: "Button",
		self: element,
	}
	return element
}

func (b *ButtonElement) Action(act string) *ButtonElement { b.Props.Action = act; return b }
func (b *ButtonElement) ActionTarget(target string) *ButtonElement {
	b.Props.ActionTarget = target
	return b
}

// ==========================================
// Text
// ==========================================
type TextProps struct {
	Value string `json:"value"`
}
type TextElement struct {
	*ElementCore[TextProps, *TextElement]
}

func Text(value string) *TextElement {
	element := &TextElement{}
	element.ElementCore = &ElementCore[TextProps, *TextElement]{
		Type:  "Text",
		Props: TextProps{Value: value},
		self:  element,
	}
	return element
}

// ==========================================
// Layout parts
// ==========================================
func Layout() *Element {
	return NewElement("PageLayout")
}

func MainColumn() *Element {
	return NewElement("PageLayout.MainColumn")
}

func AsideColumn() *Element {
	return NewElement("PageLayout.AsideColumn")
}

func Widget() *Element {
	return NewElement("Widget")
}

// ==========================================
// Page
// ==========================================
func ExamplePage() *Element {
	return Layout().Children(
		MainColumn().Children(
			Widget().Children(
				Heading().Level(2).Children(Text("Some widget")),
				Text("With message about nothing!"),
				Button().Children(Text("Do nothing")),
			),
			Widget().Children(
				Heading().Level(2).Children(Text("Other widget")),
				Text("With just text"),
			),
		),
		AsideColumn().Children(
			Widget().Children(
				Heading().Level(3).Children(Text("Sidebar")),
				Text("With meaningless paragraph..."),
			),
		),
	)
}

type PageResponseUI struct {
	Tree *Element `json:"tree"`
}

type PageResponse struct {
	UI PageResponseUI `json:"ui"`
}

func main() {
	http.HandleFunc("/bdui/page", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		tree := ExamplePage()

		_ = json.NewEncoder(w).Encode(PageResponse{
			UI: PageResponseUI{
				Tree: tree,
			},
		})
	})

	log.Println("Server started on http://localhost:8080")
	_ = http.ListenAndServe(":3200", nil)
}
