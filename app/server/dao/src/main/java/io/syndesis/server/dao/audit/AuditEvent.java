/*
 * Copyright (C) 2016 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.syndesis.server.dao.audit;

import java.util.Objects;

public class AuditEvent {

    private final String current;

    private final String previous;

    private final String property;

    private final String type;

    public AuditEvent(final String type, final String property, final String previous, final String current) {
        this.type = type;
        this.property = property;
        this.previous = previous;
        this.current = current;
    }

    public String current() {
        return current;
    }

    @Override
    public boolean equals(final Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AuditEvent)) {
            return false;
        }
        final AuditEvent that = (AuditEvent) o;
        return Objects.equals(type, that.type) &&
            Objects.equals(property, that.property) &&
            Objects.equals(previous, that.previous) &&
            Objects.equals(current, that.current);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, property, previous, current);
    }

    public String previous() {
        return previous;
    }

    public String property() {
        return property;
    }

    @Override
    public String toString() {
        return "AuditEvent{" +
            "type='" + type + '\'' +
            ", property='" + property + '\'' +
            ", previous='" + previous + '\'' +
            ", current='" + current + '\'' +
            '}';
    }

    public String type() {
        return type;
    }
}
